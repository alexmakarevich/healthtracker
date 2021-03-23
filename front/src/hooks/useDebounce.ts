import { useState, useEffect, useRef } from "react";

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function useDebounceCallbackFromValue<T>(
  value: T,
  callBack: (params: T) => any,
  delay?: number
) {
  //   const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => callBack(value), delay || 500);
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay, callBack]);

  //   return debouncedValue;
}

// https://stackoverflow.com/questions/56283920/how-to-debounce-a-callback-in-functional-component-using-hooks
export function useDebouncedCallbackVoid<A extends any[]>(
  callback: (...args: A) => void,
  wait: number
) {
  // track args & timeout handle between calls
  const argsRef = useRef<A>();
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  function cleanup() {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }
  }

  // make sure our timeout gets cleared if
  // our consuming component gets unmounted
  useEffect(() => cleanup, []);

  return function debouncedCallback(...args: A) {
    // capture latest args
    argsRef.current = args;

    // clear debounce timer
    cleanup();

    // start waiting again
    timeout.current = setTimeout(() => {
      if (argsRef.current) {
        callback(...argsRef.current);
      }
    }, wait);
  };
}
