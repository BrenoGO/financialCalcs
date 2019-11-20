$(document).ready(() => {
  generateBox(1);
});
$(document).on('click', '.addChild', e => {
  const [,i] = e.currentTarget.id.split('-');
  const newPresent = $(`#future-${i}`).val();
  generateBox(Number(i)+1, newPresent);
});
$(document).on('blur', '.inputs', calculate);
$(document).on('blur', '#rateM', () => {
  convertingRate('M');
  return calculate({
    currentTarget:{
      id:'x-1'
    }
  });
});
$(document).on('blur', '#rateY', () => {
  convertingRate('Y');
  return calculate({
    currentTarget:{
      id:'x-1'
    }
  });
});
$(document).on('change', '.whatCalc', e => {
  const [,i] = e.currentTarget.id.split('-');
  const variable = e.currentTarget.value;
  $(`.in-${i}`).attr('readonly',false);
  $(`#${variable}-${i}`).attr('readonly',true);
});
$(document).on('change', '.inputFuture', e => {
  const [,i] = e.currentTarget.id.split('-');
  
})

function convertingMonthsToYear(type, i) {
  if(type === 'M'){
    const pM = $(`#periodM-${i}`).val();
    $(`#periodY-${i}`).val((pM / 12).toFixed(1));
  }else{
    const pY = $(`#periodY-${i}`).val();
    $(`#periodM-${i}`).val(pY * 12);
  }
}
function convertingRate(type) {
  if (type === 'M') {
    const rateM = $('#rateM').val();
    const rateY = (Math.pow( (rateM / 100 + 1), 12) - 1)*100;
    $('#rateY').val(rateY.toFixed(2));
  } else {
    const rateY = $('#rateY').val();
    const rateM = (Math.pow( (rateY / 100 + 1), 1 / 12) - 1)*100;
    $('#rateM').val(rateM.toFixed(2));
  }
}

function calculate(e){
  console.log('in calculate');
  const [type, i] = e.currentTarget.id.split('-');
  const variable = $(`#whatCalc-${i}`).val();
  let addition = '';
  if(variable === 'period') {
    addition = 'M';
  }
  if (type.match(/period/)) {
    convertingMonthsToYear(type.split('eriod')[1], i);
  }
  const [present, future, period, payment, rate] = getValues(i);
  const functions = {
    present: (present, future, period, payment, rate) => getPresent(future, period, payment, rate),
    future: (present, future, period, payment, rate) => getFuture(present, period, payment, rate),
    period: (present, future, period, payment, rate) => getPeriod(present, future, payment, rate),
    payment: (present, future, period, payment, rate) => getPayment(present, future, period, rate)
  }
  const calc = functions[variable];
  console.log('in calc');
  if(calc) {
    console.log('in calc', variable);
    const result = calc(present, future, period, payment, rate);
    console.log('result', result);
    $(`#${variable}${addition}-${i}`).val(result.toFixed(2));
    console.log(`#${variable}${addition}-${i}`);
    if(variable === 'period') {
      console.log('var is period');
      convertingMonthsToYear(addition, i);
    }
  }

  if($(`#box-${Number(i)+1}`).length){
    $(`#present-${Number(i)+1}`).val($(`#future-${i}`).val());
    calculate({
      currentTarget:{
        id:`x-${Number(i)+1}`
      }
    });
  }
}

function getValues(i){
  const rate = Number($('#rateM').val()) / 100;
  const present = Number($(`#present-${i}`).val());
  const future = Number($(`#future-${i}`).val());
  const payment = Number($(`#payment-${i}`).val());
  let period = $(`#periodM-${i}`).val();
  if(period.match(/\d+|\s+\*\d+|\s+/)){
    period = eval(period);
  } else {
    period = Number(period);
  }
  return [present, future, period, payment, rate];
}

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
  if(payment < 0 && present*rate >= -payment) return Infinity;

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

function generateBox(i, presentValue = '0.00'){
  if(i > 1){
    $(`addChild-${i-1}`).hide();
  }
  const newHtml =  `
    <div class="calcBox" id="box-${i}">
      <label for="whatCalc-${i}">
        What do you want to calculate?
        <select class="whatCalc" id="whatCalc-${i}">
          <option value="present">Present</option>
          <option value="future" selected="selected">Future</option>
          <option value="payment">Payment</option>
          <option value="period">Period</option>
        </select>
      </label>
      
      </br>
      <label for="present-${i}">
        Present:
        <input type="text" class="inputs in-${i}" id="present-${i}" size="10" value="${presentValue}"/>
      </label>
      </br>
      <label for="period-${i}">
        Period:
        <input type="text" class="inputs in-${i}" id="periodM-${i}" size="6" value="36"/>
        Months or 
        <input type="text" class="inputs in-${i}" id="periodY-${i}" size="6" value="3"/>Years
      </label>
      </br>
      <label for="payment-${i}">
        Payment:
        <input type="text" class="inputs in-${i}" id="payment-${i}" size="8"/>
      </label>
      </br>
      <label for="future-${i}">
        Future:
        <input type="text" class="inputs in-${i} inputFuture" id="future-${i}" size="10" readonly />
      </label>
      </br>
      <button class="addChild" id="addChild-${i}">Add Calc Box with this future value being the present</button>
    </div>  
  `;
  $('#container').append(newHtml);
}

