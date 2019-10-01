$(document).ready(() => {
  generateBox(1);
});
$(document).on('click', '.addChild', e => {
  const [,i] = e.currentTarget.id.split('-');
  const newPresent = $(`#future-${i}`).val();
  generateBox(Number(i)+1, newPresent);
});
$(document).on('blur', '.inputs', calculate);
$(document).on('blur', '#rate', () => calculate({
  currentTarget:{
    id:'x-1'
  }
}));
$(document).on('change', '.whatCalc', e => {
  const [,i] = e.currentTarget.id.split('-');
  const variable = e.currentTarget.value;
  $(`.in-${i}`).attr('readonly',false);
  $(`#${variable}-${i}`).attr('readonly',true);
});
$(document).on('change', '.inputFuture', e => {
  const [,i] = e.currentTarget.id.split('-');
  
})

function calculate(e){
  const [, i] = e.currentTarget.id.split('-');
  const variable = $(`#whatCalc-${i}`).val();
  
  const [present, future, period, payment, rate] = getValues(i);
  let result;
  
  switch (variable) {
    case 'present':
      result = getPresent(future, period, payment, rate);
      break;
    case 'future':
      result = getFuture(present, period, payment, rate);
      break;
    case 'period':
      result = getPeriod(present, future, payment, rate);
      break;
    case 'payment':
      result = getPayment(present, future, period, rate);
      break;
    default:
      break;
  }
  $(`#${variable}-${i}`).val(result.toFixed(2));

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
  const rate = Number($('#rate').val()) / 100;
  const present = Number($(`#present-${i}`).val());
  const future = Number($(`#future-${i}`).val());
  const payment = Number($(`#payment-${i}`).val());
  let period = $(`#period-${i}`).val();
  if(period.match(/\d+\*\d+/)){
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
        Period (in Months):
        <input type="text" class="inputs in-${i}" id="period-${i}" size="6" value="12*3"/>
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

