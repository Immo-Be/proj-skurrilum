// Title.jsx
import React, {useState, useEffect} from 'react';

const Title = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('count changed', count);
  }, []);

  return (
    <>
      <h1 className={`bg-black p-2 pt-4`}>{count}</h1>
      <button
        onClick={() => {
          setCount(prev => prev + 1);
          console.log('count', count);
        }}>
        Click to increase
      </button>
    </>
  );
};

export default Title;
