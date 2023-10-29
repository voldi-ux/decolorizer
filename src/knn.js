import moduleTransformations from "babel-preset-env/lib/module-transformations";

/** @format */
const getDistance = (vector1, vevctor2) => Math.sqrt(vector1.map((value, index) => (value - vevctor2[index]) ** 2).reduce((acc, v) => acc + v, 0));

class KNN {
    constructor(k=1,data,lables) {
        this.k = k;
        this.data = data;
        this.lables = lables;
    }
    
    generateDistanceMap(point) {
        let map = [];
        let maxDistance = null;

        for (let index = 0; index < this.data.length; index++) {
            const trainingPoint = this.data[index];
            const trainingPointLabel = this.lables[index];
            const distance = getDistance(point, trainingPoint);
            
            if (!maxDistance || distance < maxDistance) {
                map.push({
                    index,
                    distance,
                    trainingPointLabel
                })
                 //sort in ascending order
                map.sort((a, b) => a.distance - b.distance);

                if (map.length > this.k) {
                    map.pop();
                }

                //update the maxDisance in the map object/array
                maxDistance = map[map.length -1 ].distance;
            }
        }
       
        return map;
    }


    predict(point) { 
        const map = this.generateDistanceMap(point);
        const votes = map.slice(0, this.k);
        const votesCounts = votes.reduce((obj, vote) => Object.assign({}, obj, { [vote.trainingPointLabel]: (obj[vote.trainingPointLabel] || 0) + 1 }), {});
        //sorting in ascending order
        const sortedVotes = Object.keys(votesCounts).map(label => ({ label, counts: votesCounts[label] })).sort((a, b) => a.counts - b.counts);
        
      
        return {
            label: sortedVotes[sortedVotes.length - 1].label,
            votes,
            votesCounts,
            sortedVotes
        }
    }

};



export default KNN;