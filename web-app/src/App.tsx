import React from 'react';
import IotSubscriber from './components/IotSubscriber';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>AWS IoT Core Web Subscriber</h1>
      </header>
      <main>
        <IotSubscriber />
      </main>
    </div>
  );
}

export default App;
