## 2019年8月12日 20:11:44

迫于工作需要，前来学习tensorflow，需要完成基础的图像识别功能，最终目的是构建出类VR的前端沉浸式体验。首先按照书中的介绍以及官网的简介，安装tensorflow.js 相关的内容。第一步：

```shell
npm install @tensorflow/tfjs 
```

搞定基础的依赖问题，接下来就要对付难啃的英文文档了，跟着书一起敲。

## 2019年8月13日 09:26:13

 [tfjs-vis](https://github.com/tensorflow/tfjs-vis) 提供了一个数据可视化的工具，方便大家可以直观看到自变量和因变量之间的关系。

特别说明，如果数据看起来就是随机的，没有结构模式的，也就是我们感觉总结不出来规律的时候，这个模型明显就凉了。

tf 提供了一个连续模型的创建方法 const model = tf.sequential(); ，我们可以在这个模型上添加不同的 layer，此处的 layer 在表现形式上不是前端前端地图中的图层概念，而是作为 model 表格中的一行，而且看下面图层添加的语句

```javascript
model.add(tf.layers.dense({ inputShape: [1], units: 1, useBias: true }));
```

对于  inputShape: [1] 这个配置项（也就是指定一个数字作为我们的输入），从表格中根本看不出区别。

`注意`教程中创建模型的代码，要写在 run() 函数中

```javascript
async function run() {
    // ...

    // More code will be added below
    const model = createModel();
    tfvis.show.modelSummary({ name: 'Model Summary' }, model);
}
```

在进一步处理数据的过程中,需要做三步

1. 将数据洗牌(也就是打散数据),这是一种最佳实践
2. 转换为张量
3. 将数据标准化(利用特征缩放等方法),这是一种最佳实践

具体的训练步骤

1. 训练之前,先指定一个优化器 optimizer ,一个处理偏差数据的函数 loss
2. 指定玄学的批量处理大小 batchSize (它类似于指定程序占用的内存, 对于图形领域,我们一般要把这个调到GPU能承受的最大值,官方推荐 32-512 ),以及迭代次数 epochs
3. 写出真正的训练函数,传入 batchSize 和 epochs, 指定处理结果的回调
4. 在 run() 中调用 trainModel,传入我们创建的 model, 以及经过处理的 inputs 数据, labels 数据.
5. 在页面上看到模拟效果(就这点数据,竟然这么慢......),将散点模拟成了一条连续的光滑曲线.(我咋觉得这么像之前自动控制原理里的一种曲线模拟呢?那会是用 matlab 做的,那么 tensorflow 做了什么?跟 matlab 做的是一样的事情吗?留作思考题)


## 2019年8月14日 10:43:20

知识点总结

1. 分析工作
2. 准备数据
3. 创建模型
4. 运行模型
5. 模型评估

![流程图](D:\study\tensorflow\images\流程图.png)

拓展训练

1. 改变迭代次数(epochs)
2. 改变 units 数
3. 添加更多的隐藏图层 ```model.add(tf.layers.dense({units: 50, activation: 'sigmoid'}));``` 注意此处的激活函数更换成了S形

截至目前,最好的拟合如下图所示

![效果图](D:\study\tensorflow\images\效果图.png)

代码如下

```javascript
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
    model.add(tf.layers.dense({ inputShape: [1], units: 1, useBias: true }));

    model.add(tf.layers.dense({units: 50, activation: 'sigmoid'}));
    model.add(tf.layers.dense({units: 50, activation: 'sigmoid'}));
    model.add(tf.layers.dense({units: 50, activation: 'sigmoid'}));
    model.add(tf.layers.dense({units: 50, activation: 'sigmoid'}));
    model.add(tf.layers.dense({units: 50, activation: 'sigmoid'}));

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

    // 这是一个玄学参数(需要多次调参才能确定最大值,在图形领域,一般要把GPU跑满)
    // 官方给的参考范围是 32-512
    const batchSize = 32;
    // 迭代次数
    const epochs = 50;

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
```

