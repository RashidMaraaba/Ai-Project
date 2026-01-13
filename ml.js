function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function trainPerceptron(dataset, epochs = 70) {

    dataset = shuffle([...dataset]); // clone + shuffle

    const trainSize = Math.floor(dataset.length * 0.8);
    const trainSet = dataset.slice(0, trainSize);
    const testSet  = dataset.slice(trainSize);

    const featureCount = dataset[0].length - 1;

    let weights = new Array(featureCount).fill(0);
    let bias = 0;
    let lr = 0.01;

    for (let epoch = 0; epoch < epochs; epoch++) {
        for (let row of trainSet) {

            let x = row.slice(0, featureCount);
            let y = row[featureCount];

            let activation = bias;
            for (let i = 0; i < featureCount; i++)
                activation += weights[i] * x[i];

            let pred = activation >= 0 ? 1 : -1;

            if (pred !== y) {
                for (let i = 0; i < featureCount; i++)
                    weights[i] += lr * y * x[i];
                bias += lr * y;
            }
        }
    }

    // Accuracy on test set
    let correct = 0;
    for (let row of testSet) {
        let x = row.slice(0, featureCount);
        let y = row[featureCount];

        let activation = bias;
        for (let i = 0; i < featureCount; i++)
            activation += weights[i] * x[i];

        let pred = activation >= 0 ? 1 : -1;
        if (pred === y) correct++;
    }

    return {
        weights,
        bias,
        accuracy: correct / testSet.length
    };
}

function mlEvaluate(features) {
    let weights = JSON.parse(localStorage.getItem("modelWeights"));
    let bias = parseFloat(localStorage.getItem("modelBias"));

    if (!weights || !Array.isArray(weights) || isNaN(bias)) {
        console.warn("ML model not ready, returning 0");
        return 0;
    }

    if (weights.length !== features.length) {
        console.warn("Feature mismatch, returning 0");
        return 0;
    }

    let sum = bias;
    for (let i = 0; i < weights.length; i++) {
        sum += weights[i] * features[i];
    }

    return sum;
}
