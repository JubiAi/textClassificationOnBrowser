
let d1 = "How are you"
let d2 = "Where do you live"

let nlp={
	tokenize:(text)=>text.toLowerCase().split(/\s+/g),
	dictionary:(tokens,dict)=>{
					    tokens.forEach((token)=>{
						    if(!dict.includes(token)){
						        dict.push(token)
						    }
						})
						return dict
					},
	vsm:(tokens,dict)=>dict.map((token)=>tokens.reduce((acc,curr)=>curr == token?acc +1:acc,0)),
	tf:(vsm,numberOfTokens)=>vsm.map((token)=>token/numberOfTokens),
	idf:(documentTokens,dict)=>dict.map((word)=>Math.log(documentTokens.length/documentTokens.reduce((acc,curr)=>curr.includes(word)?1:0+acc,0))),
	tfidf:(tf,idf)=>tf.map((element,index)=>element*idf[index]),
	cosine:(tfIdf1,tfIdf2)=>tfIdf1.reduce((acc,curr,index)=>acc+curr*tfIdf2[index],0) / (Math.sqrt(tfIdf1.reduce((acc,curr)=>acc+curr*curr,0))*Math.sqrt(tfIdf2.reduce((acc,curr)=>acc+curr*curr,0)))
}





let dict = []


let d1Tokens = nlp.tokenize(d1)
let d2Tokens = nlp.tokenize(d2)

dict=nlp.dictionary(d1Tokens,dict)
dict=nlp.dictionary(d1Tokens,dict)

let d1Vsm = nlp.vsm(d1Tokens,dict)
let d2Vsm = nlp.vsm(d2Tokens,dict)

let d1tf = nlp.tf(d1Vsm,d1Tokens.length)
let d2tf = nlp.tf(d2Vsm,d2Tokens.length)

let idf = nlp.idf([d1Tokens,d2Tokens],dict)

let d1tfidf = nlp.tfidf(d1tf,idf)
let d2tfidf = nlp.tfidf(d2tf,idf)

//======================================

let query = process.argv[2]
let queryTokens = nlp.tokenize(query)
let queryVsm = nlp.vsm(queryTokens,dict)
let querytf = nlp.tf(queryVsm,queryTokens.length)
let querytfidf = nlp.tfidf(querytf,idf)

let cosineSim1 = nlp.cosine(d1tfidf,querytfidf)
let cosineSim2 = nlp.cosine(d2tfidf,querytfidf)

console.log(cosineSim1>cosineSim2?"I am fine":"Krypton")