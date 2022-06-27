import React, { useEffect, useState } from 'react';
import * as mqtt from 'mqtt';
import './App.css';

const App = () => {
  const [opacity, setOpacity] = useState(0.25);
  const [client, setClient] = useState(null);

  const handleClick = message => {
    client.publish('first', message);
  };

  useEffect(() => {
    if (client) {
      client.on('connect', () => {
        console.log('Connected');

        client.subscribe('first');
        client.subscribe('second');
      });

      client.on('message', (topic, msg) => {
        if (topic === 'first' && msg.toString() === 'Installing') {
          client.publish('second', 'next');
          const payloadFirst = { topic, msg: msg.toString() };
          console.log('payload 1 ::', payloadFirst);
        }
        if (topic === 'second' && msg.toString() === 'next') {
          const payloadSecond = { topic, msg: msg.toString() };
          console.log('payload 2 ::', payloadSecond);
        }
        if (opacity >= 0.25) {
          setOpacity(0.5);
        }
        if (opacity >= 0.5) {
          setOpacity(1);
        }
        if (opacity >= 1) {
          setOpacity(0.25);
        }
      });
      client.on('error', err => {
        console.log(err);
      });
    }
  }, [client]);

  useEffect(() => {
    setClient(mqtt.connect(`mqtt://broker.hivemq.com:8000/mqtt`));
  }, []);

  return (
    <div className="box">
      <div className="pic">
        <img
          style={{ opacity: opacity + 0.25 }}
          src="https://e7.pngegg.com/pngimages/663/813/png-clipart-beige-parquet-board-hardwood-wood-stain-varnish-wall-floor-wood-textures-texture-angle.png"
        />
        <img
          style={{ opacity: opacity }}
          src="https://e7.pngegg.com/pngimages/663/813/png-clipart-beige-parquet-board-hardwood-wood-stain-varnish-wall-floor-wood-textures-texture-angle.png"
        />
      </div>
      <button type="submit" onClick={() => handleClick('Installing')}>
        Install
      </button>
    </div>
  );
};

export default App;
