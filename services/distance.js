const Distance = require('../models/distance');
const https = require('https')
module.exports = {
    get: (req, res) => {
        let source = req.query.source;
        let destination = req.query.destination;

        Distance.findOne({ $or:[{source,destination},{source:destination, destination:source}]}, async (err, d) => {
            if (err) throw err;
            if (d) {
                if(d.destination == source){
                    d.destination = source
                    d.source =destination
                } 
                await updateCounter(d);
                res.json(d).status(200);;
            } else {
                https.get(`https://www.merchak.org/route.json?origin=${source}&destination=${destination}`, (resp) => {
                    let data = '';

                    resp.on('data', (chunk) => {
                        data += chunk;
                    });
                    
                    resp.on('end', () => {
                    
                        const d = JSON.parse(data);
                        if(d.distance == 0 && source != destination){
                            console.log("Error: an uncorrect city" );
                            res.status(500).json("Error: the cities names are incorrect")
                        }
                        else{
                            const distance = new Distance({source, destination, distance: d.distance, counter: 1})
                        distance.save((err, newDistance) => {
                            if (err) throw err;
                            res.json(newDistance).status(201);;
                        });}
                    });

                }).on("error", (err) => {
                    console.log("Error: " + err.message);
                });
            }

        });

        function updateCounter(destination) {
            destination.counter += 1;
            return destination.save().then();
        }
    },

    getpopularsearch: (req, res) => {
        Distance.find({})
            .select({'source': 1, 'destination': 1,'counter':1})
            .sort({"counter": -1})
            .limit(1)
            .exec(function (err, doc) {
                res.json(doc).status(200);;
            });
    },
    create: (req, res) => {
        let distance = req.body;
        let d = new Distance(distance);
        let source = d.source
        let destination = d.destination
        Distance.findOne({ $or:[{source,destination},{source:destination, destination:source}]}, async (err, dis) => {
            if (err) throw err;
            if (dis) {
                if(dis.destination == source){
                    dis.destination = source
                    dis.source = destination
                } 
           
            await updateDistance(dis,d.distance);
            res.json(dis);}
            else{
                d.counter = 0
                d.save((err, dist) => {
                    if (err) throw err;
                    res.json(dist).status(201);;
                });
            }
        }
        )
                 

        function updateDistance(dis,distance) {
            if(distance<0||(( distance == 0)&&( dis.source != dis.destination)))
            {
                res.status(500).json("Error: negetive distance")
            }
            dis.distance = distance;
        return dis.save().then();
        }
    },
   
    
};
