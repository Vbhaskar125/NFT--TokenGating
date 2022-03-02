const TokenGating = artifacts.require("TokenGating.sol");


contract('token gating test', (accounts)=>{
 
    var instance;
    before(async()=>{
        instance =await TokenGating.deployed();
    await instance.safeMint(accounts[1]);
    await instance.safeMint(accounts[0]);
    await instance.safeMint(accounts[2]);
    await instance.safeMint(accounts[0]);
    await instance.safeMint(accounts[0]);
    await instance.safeMint(accounts[0]);
    await instance.safeMint(accounts[0]);
    await instance.safeMint(accounts[0]);
    //console.log(await instance.balanceOf(accounts[0]));
    let seriesA =[0,1], seriesB =[2,3], seriesC=[4,5], seriesD=[6,7];
    let collectionA = await instance.createCollection("series-A",seriesA);
    let collectionB = await instance.createCollection("series-B",seriesB);
    let collectionC = await instance.createCollection("series-C",seriesC);
    let collectionD = await instance.createCollection("series-D",seriesD);
    await instance.createPromo("promo1",["series-A",],["series-C",]);
    await instance.createPromo("promo2",["series-B"],["series-D"]);

    });

// it('return from getEligible',async()=>{
    //console.log(await instance.totalSupply())
//     await instance.safeMint(accounts[1]);
//     await instance.safeMint(accounts[2]);
//     //console.log(await instance.tokenOfOwnerByIndex(accounts[1],0));
//     let  idList = await instance.fetchEligible(accounts[1],{from:accounts[1]});
//     console.log(idList);
//    // console.log(listId)
//    let  idList2 = await instance.fetchEligible(accounts[2],{from:accounts[2]});
//     console.log(idList2);
    
   
// });

// it('create and get promo object', async()=>{
    
    
//     let pp1=await instance.createPromo("promo1",["series-A",],["series-C",]);
//     let pp2= await instance.createPromo("promo2",["series-B"],["series-D"])
//     let p1 =await instance.getAllPromos()

//     console.log(p1);
//     console.log("account 0 owns: "+await instance.ownerOf(7))
//     //console.log("promoname is : "+ p1[0].promoName);
// });



it('testing exclusive access for owner of series-A nft.. should return series-C nfts', async()=>{
    //get Early access nft for accounts[1]

    //log the nft owned by account[1] aka visitor
    //console.log("visitor owns tokenId: "+await instance.tokenOfOwnerByIndex(accounts[1],0))
    
    let ownedColl = await instance.getOwnedCollection(accounts[2]);
    console.log("the collections owned by visitor are:  "+ ownedColl);
    let allPromos = await instance.getAllPromos();
    //console.log("all promos: "+ allPromos)
    let promocount = allPromos.length;
    let allEAPromos =new Set(); //list of all eligible promos
    for(promos of allPromos){
        let EligColl = promos.eligibleCollections; //string[] of eligible collec
        for(collecs of ownedColl){ //string[] of collection names
            //search if any item of ownedcoll is in eligcoll
            for(coll of EligColl){
                if(coll == collecs) allEAPromos.add(promos)
                
            }
            
        }
    }
    console.log("EA collections eligible for the visitor are  :"+ allEAPromos.size)
   
    let EAtokenArr =[];
    for(obj of allEAPromos){
        let EAcolls= obj.earlyAccessCollections;
        
        for(colname of EAcolls){
            let tokenarr= await instance.getCollection(colname);
            for(tokId of tokenarr){
            EAtokenArr.push(tokId); 
            }           
        }
        // console.log("debugg  : " +typeof(obj.promoName))
        // console.log("debugg  : " +EAcolls[0])
        // console.log("debugg  : " +obj.earlyAccessCollections)


    }




// let text ="";
// allEAPromos.forEach((element)=>{text+= element.promoName})

    console.log("all EA tokens: "+ EAtokenArr)


});


});