const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let currentValue = '0';
let firstOperand = null;
let operator = null;
let shouldResetDisplay = false;

function updateDisplay() {
  display.textContent = currentValue;
}

function clearCalculator() {
  currentValue = '0';
  firstOperand = null;
  operator = null;
  shouldResetDisplay = false;
  updateDisplay();
}

function deleteLastCharacter() {
  if (currentValue.length <= 1 || (currentValue.length === 2 && currentValue.startsWith('-'))) {
    currentValue = '0';
  } else {
    currentValue = currentValue.slice(0, -1);
  }
  updateDisplay();
}

function inputDigit(value) {
  if (shouldResetDisplay) {
    currentValue = value;
    shouldResetDisplay = false;
  } else {
    currentValue = currentValue === '0' ? value : currentValue + value;
  }
  updateDisplay();
}

function inputDecimal() {
  if (shouldResetDisplay) {
    currentValue = '0.';
    shouldResetDisplay = false;
    updateDisplay();
    return;
  }

  if (!currentValue.includes('.')) {
    currentValue += '.';
    updateDisplay();
  }
}

function performCalculation() {
  if (firstOperand === null || operator === null) return;

  const secondOperand = Number(currentValue);
  let result;

  switch (operator) {
    case '+':
      result = firstOperand + secondOperand;
      break;
    case '-':
      result = firstOperand - secondOperand;
      break;
    case '*':
      result = firstOperand * secondOperand;
      break;
    case '/':
      result = secondOperand === 0 ? 'Error' : firstOperand / secondOperand;
      break;
    default:
      return;
  }

  currentValue = result.toString();
  firstOperand = null;
  operator = null;
  shouldResetDisplay = true;
  updateDisplay();
}

function handleOperator(nextOperator) {
  const inputValue = Number(currentValue);

  if (firstOperand === null) {
    firstOperand = inputValue;
  } else if (operator) {
    performCalculation();
    firstOperand = Number(currentValue);
  }

  operator = nextOperator;
  shouldResetDisplay = true;
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;
    const value = button.dataset.value;

    if (action === 'clear') {
      clearCalculator();
      return;
    }

    if (action === 'delete') {
      deleteLastCharacter();
      return;
    }

    if (action === 'calculate') {
      performCalculation();
      return;
    }

    if (value) {
      if (['+', '-', '*', '/'].includes(value)) {
        handleOperator(value);
        return;
      }

      if (value === '.') {
        inputDecimal();
        return;
      }

      inputDigit(value);
    }
  });
});

document.addEventListener('keydown', (event) => {
  const key = event.key;

  if (/^[0-9]$/.test(key)) {
    inputDigit(key);
  }

  if (key === '.') {
    inputDecimal();
  }

  if (['+', '-', '*', '/'].includes(key)) {
    handleOperator(key);
  }

  if (key === 'Enter' || key === '=') {
    performCalculation();
  }

  if (key === 'Backspace') {
    deleteLastCharacter();
  }

  if (key === 'Escape') {
    clearCalculator();
  }
});

updateDisplay();
