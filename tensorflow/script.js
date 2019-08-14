// 拿到数据,做清洗
async function getData() {
    const carsDataReq = await fetch('https://storage.googleapis.com/tfjs-tutorials/carsData.json');
    const carsData = await carsDataReq.json();
    const cleaned = carsData.map(car => ({
        mpg: car.Miles_per_Gallon,
        horsepower: car.Horsepower,
    }))
        .filter(car => (car.mpg != null && car.horsepower != null));
    console.log('cleaned', cleaned);
    return cleaned;
}

// 用来定义模型的结构
function createModel() {
    // Create a sequential model  连续模型
    const model = tf.sequential();

    // Add a single hidden layer
    model.add(tf.layers.dense({ inputShape: [1], units: 10, useBias: true, activation: 'relu' }));
    model.add(tf.layers.dense({ inputShape: [1], units: 10, useBias: true, activation: 'relu' }));

    // Add an output layer
    model.add(tf.layers.dense({ units: 1, useBias: true }));

    return model;
}

/**
 * Convert the input data to tensors that we can use for machine
 * learning. We will also do the important best practices of _shuffling_
 * the data and _normalizing_ the data
 * MPG on the y-axis.
 */
function convertToTensor(data) {
    // Wrapping these calculations in a tidy will dispose any
    // intermediate tensors.

    return tf.tidy(() => {
        // Step 1. Shuffle the data 洗牌
        // 洗牌是一种最佳实践,为了 1.不依赖于输入顺序 2.对于子组件中结构不敏感
        tf.util.shuffle(data);

        // Step 2. Convert data to Tensor 将数据转换为张量
        const inputs = data.map(d => d.horsepower);
        // 这就是机器学习里的张量
        const labels = data.map(d => d.mpg);

        // 转换成 2d 的 tensor(张量)
        // [num_examples, num_features_per_example]
        const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
        const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

        //Step 3. Normalize the data to the range 0 - 1 using min-max scaling
        // 标准化数据也是一种最佳实践
        // 此处使用的是特征缩放
        // Common ranges to normalize data to include 0 to 1 or -1 to 1.
        const inputMax = inputTensor.max();
        const inputMin = inputTensor.min();
        const labelMax = labelTensor.max();
        const labelMin = labelTensor.min();

        const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
        const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));

        return {
            inputs: normalizedInputs,
            labels: normalizedLabels,
            // Return the min/max bounds so we can use them later.
            inputMax,
            inputMin,
            labelMax,
            labelMin,
        };
    });
}

async function trainModel(model, inputs, labels) {
    // Prepare the model for training.
    model.compile({
        // 选择优化工具(有好多可选)
        optimizer: tf.train.adam(),
        // 用来查看差值的方法(比较预测值跟实际值之间的差异)
        loss: tf.losses.meanSquaredError,
        metrics: ['mse'],
    });

    // 这是一个玄学参数(需要多次调参才能确定最大值,在图形领域,一般要把GPU内存跑满)
    // 官方给的参考范围是 32-512
    const batchSize = 32;
    // 迭代次数
    const epochs = 100;

    // 开启模型训练
    return await model.fit(inputs, labels, {
        batchSize,
        epochs,
        shuffle: true,
        // 由于这是一个 promise,所以我们需要一个回调函数指定对结果的处理
        callbacks: tfvis.show.fitCallbacks(
            { name: 'Training Performance' },
            ['loss', 'mse'],
            { height: 200, callbacks: ['onEpochEnd'] }
        )
    });
}

function testModel(model, inputData, normalizationData) {
    const { inputMax, inputMin, labelMin, labelMax } = normalizationData;

    // Generate predictions for a uniform range of numbers between 0 and 1;
    // We un-normalize the data by doing the inverse of the min-max scaling
    // that we did earlier.
    const [xs, preds] = tf.tidy(() => {
        // We generate 100 new ‘examples' to feed to the model.
        const xs = tf.linspace(0, 1, 100);
        // a similar shape ([num_examples, num_features_per_example]) as when we did training.
        const preds = model.predict(xs.reshape([100, 1]));

        // 将标准化数据 逆标准化
        // Un-normalize the data
        const unNormXs = xs
            .mul(inputMax.sub(inputMin))
            .add(inputMin);

        const unNormPreds = preds
            .mul(labelMax.sub(labelMin))
            .add(labelMin);

        // .dataSync() is a method we can use to get a typedarray of the values stored in a tensor.
        return [unNormXs.dataSync(), unNormPreds.dataSync()];
    });


    const predictedPoints = Array.from(xs).map((val, i) => {
        return { x: val, y: preds[i] };
    });

    const originalPoints = inputData.map(d => ({
        x: d.horsepower, y: d.mpg,
    }));


    tfvis.render.scatterplot(
        { name: 'Model Predictions vs Original Data' },
        { values: [originalPoints, predictedPoints], series: ['original', 'predicted'] },
        {
            xLabel: 'Horsepower',
            yLabel: 'MPG',
            height: 300
        }
    );
}

async function run() {
    // Load and plot the original input data that we are going to train on.
    const data = await getData();
    const values = data.map(d => ({
        x: d.horsepower,
        y: d.mpg,
    }));

    // show data
    tfvis.render.scatterplot(
        { name: 'Horsepower v MPG' },
        { values },
        {
            xLabel: 'Horsepower',
            yLabel: 'MPG',
            height: 300
        }
    );

    // More code will be added below
    const model = createModel();
    tfvis.show.modelSummary({ name: 'Model Summary' }, model);

    // Convert the data to a form we can use for training.
    const tensorData = convertToTensor(data);
    const { inputs, labels } = tensorData;

    // Train the model
    await trainModel(model, inputs, labels);
    console.log('Done Training');

    testModel(model, data, tensorData);
}

document.addEventListener('DOMContentLoaded', run);
