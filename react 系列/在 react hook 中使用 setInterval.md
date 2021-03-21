# 在 react hook 中使用 setInterval

需求: 一个自增计数器,通过按钮控制

### class 方案: 两个变量,一个指向计数器的值,一个指向 setInterval 的 id

```tsx
import React from 'react';

interface State {
  timer: number | null,
  count: number
}

export default class TimerWithClass extends React.Component {
  state: State = {
    timer: null,
    count: 0,
  };

  start = () => {
    if (this.state.timer === null) {
      const id = window.setInterval(() => {
        this.setState({
          count: this.state.count + 1,
        });
      }, 1000);
      this.setState({
        timer: id,
      });
    }
  };

  stop = () => {
    if (this.state.timer !== null) {
      window.clearInterval(this.state.timer);
      this.setState({
        timer: null,
      });
    }
  };

  render() {
    return (
      <div>
        数字: {this.state.count}
        <button onClick={this.start}>开始</button>
        <button onClick={this.stop}>结束</button>
      </div>
    );
  }
}
```

### Hooks 硬改版本: 还是按照 class 版本的思路

```tsx
import React, {useState} from 'react';

export default function TimerWithClass() {
  const [count, setCount] = useState<number>(0);
  const [timer, setTimer] = useState<number | null>(null);

  function start() {
    if (timer === null) {
      const id = window.setInterval(() => {
        setCount(prevCount => prevCount + 1);
      }, 1000);
      setTimer(id);
    }
  }

  function stop() {
    if (timer !== null) {
      window.clearInterval(timer);
      setTimer(null);
    }
  }

  return (<div>
    数字: {count}
    <button onClick={start}>开始</button>
    <button onClick={stop}>结束</button>
  </div>);
}
```

### Hooks 升级版本, 使用 isRunning 控制计数器

```tsx
import React, {useState, useEffect} from 'react';

export default function TimerWithHooksUpdate() {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let id: number | null = null;
    if (isRunning) {
      id = window.setInterval(() => {
        setCount(prevCount => prevCount + 1);
      }, 1000);
    }
    return () => {
      id && clearInterval(id);
    };
  });


  function start() {
    setIsRunning(true);
  }

  function stop() {
    setIsRunning(false);
  }

  return (<div>
    数字: {count}
    <button onClick={start}>开始</button>
    <button onClick={stop}>结束</button>
  </div>);
}
```

### 优雅的 Hooks 版本,将计数器分离 

### 出自 [Dan Abramov](https://mobile.twitter.com/dan_abramov) 的文章 [Making setInterval Declarative with React Hooks](https://overreacted.io/making-setinterval-declarative-with-react-hooks/) 

```tsx
import React, {useState} from 'react';
import useInterval from './useInterval';

export default function TimerWithHooksUpdate() {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useInterval(() => {
    setCount(count + 1);
  }, isRunning ? 1000 : null);

  function start() {
    setIsRunning(true);
  }

  function stop() {
    setIsRunning(false);
  }

  return (<div>
    数字: {count}
    <button onClick={start}>开始</button>
    <button onClick={stop}>结束</button>
  </div>);
}

// useInterval
import React, {useEffect, useRef} from 'react';

type IntervalCallbackFunction = () => (unknown | void)

export default function useInterval(callback: IntervalCallbackFunction, delay: number | null) {
  // 用来保存 callback
  const savedCallback = useRef<IntervalCallbackFunction>();

  // 保存 callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // 设置 interval
  useEffect(() => {
    if (delay !== null) {
      const id = window.setInterval(() => {
        savedCallback.current && savedCallback.current();
      }, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
```