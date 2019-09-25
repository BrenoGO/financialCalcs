function getPresent(future, period, payment, rate) {
  if(rate === 0) return future - period*payment;
  
  const val1 = future / Math.pow((1+rate),period);
  const val2 = payment * ( Math.pow((1+rate),period)-1 ) / ( rate * Math.pow((1+rate),period) )
  return val1 - val2;
}

function getFuture(present, period, payment, rate) {
  if(rate === 0) return present + period*payment;
  
  const val1 = present * Math.pow((1+rate),period);
  const val2 = payment * ( Math.pow((1+rate),period)-1 ) / rate;
  
  return val1 + val2;
}

function getPeriod(present, future, payment, rate) {
  if(rate === 0) return (future - present) / payment;
   
  const val1 = payment + future*rate;
  const val2 = payment + present*rate;
   
  return Math.log(val1/val2)/Math.log(1 + rate);
}

function getPayment(present, future, period, rate) { 
  if(rate === 0) return (future - present) / period;
  
  const val1 = future - present*Math.pow((1+rate),period)
  const val2 = Math.pow((1+rate),period) - 1
  
  return val1*rate / val2
}



