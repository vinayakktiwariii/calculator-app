// ================================================
// PREMIUM CALCULATOR - COMPLETE JAVASCRIPT
// ================================================

class Calculator {
    constructor() {
        this.currentMode = 'normal';
        this.currentInput = '';
        this.result = '0';
        this.history = [];
        this.lastAnswer = 0;
        this.angleMode = 'deg';
        this.formulas = this.initializeFormulas();
        this.init();
    }

    init() {
        this.setupModeSwitch();
        this.setupThemeToggle();
        this.setupCalculatorButtons();
        this.setupKeyboard();
        this.setupHistory();
        this.setupFormulas();
        this.loadHistory();
    }

    // ============ MODE SWITCHING ============
    setupModeSwitch() {
        const modeButtons = document.querySelectorAll('.mode-btn');
        const views = document.querySelectorAll('.calculator-view');

        modeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const mode = btn.dataset.mode;
                
                modeButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                views.forEach(v => v.classList.remove('active'));
                document.getElementById(`${mode}Calc`).classList.add('active');
                
                this.currentMode = mode;
                this.clear();
            });
        });
    }

    // ============ THEME TOGGLE ============
    setupThemeToggle() {
        const toggle = document.getElementById('themeToggle');
        const html = document.documentElement;
        
        // Load saved theme
        const savedTheme = localStorage.getItem('calculatorTheme') || 'light';
        if (savedTheme === 'dark') {
            html.setAttribute('data-theme', 'dark');
            toggle.textContent = '🌙';
        }
        
        toggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            html.setAttribute('data-theme', newTheme);
            toggle.textContent = newTheme === 'dark' ? '🌙' : '🌞';
            localStorage.setItem('calculatorTheme', newTheme);
        });
    }

    // ============ CALCULATOR BUTTONS ============
    setupCalculatorButtons() {
        const buttons = document.querySelectorAll('.calc-btn');
        
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const value = btn.dataset.value;
                const action = btn.dataset.action;
                
                if (value) {
                    this.handleInput(value);
                } else if (action === 'clear') {
                    this.clear();
                } else if (action === 'equals') {
                    this.calculate();
                } else if (action === 'backspace') {
                    this.backspace();
                }
            });
        });
    }

    // ============ KEYBOARD SUPPORT ============
    setupKeyboard() {
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') {
                return;
            }

            if (this.currentMode === 'formula') return;

            if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
                this.handleInput(e.key);
            } else if (['+', '-', '*', '/'].includes(e.key)) {
                this.handleInput(e.key);
            } else if (e.key === 'Enter' || e.key === '=') {
                e.preventDefault();
                this.calculate();
            } else if (e.key === 'Backspace') {
                e.preventDefault();
                this.backspace();
            } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
                this.clear();
            } else if (e.key === '%') {
                this.handleInput('%');
            } else if (e.key === '(' || e.key === ')') {
                this.handleInput(e.key);
            }
        });
    }

    // ============ INPUT HANDLING ============
    handleInput(value) {
        if (this.currentMode === 'formula') return;

        if (value === 'ans') {
            value = this.lastAnswer.toString();
        }

        if (['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'log', 'ln', 'sqrt'].includes(value)) {
            this.currentInput += value + '(';
        } else if (value === 'pi') {
            this.currentInput += Math.PI;
        } else if (value === 'e') {
            this.currentInput += Math.E;
        } else if (value === '^') {
            this.currentInput += '**';
        } else if (value === 'x2') {
            this.currentInput += '**2';
        } else if (value === 'x3') {
            this.currentInput += '**3';
        } else if (value === '!') {
            this.currentInput += '!';
        } else {
            this.currentInput += value;
        }

        this.updateDisplay();
    }

    backspace() {
        this.currentInput = this.currentInput.slice(0, -1);
        this.updateDisplay();
    }

    clear() {
        this.currentInput = '';
        this.result = '0';
        this.updateDisplay();
    }

    // ============ CALCULATION ============
    calculate() {
        if (!this.currentInput) return;

        try {
            let expression = this.currentInput;

            // Handle factorial
            expression = expression.replace(/(\d+)!/g, (match, num) => {
                return this.factorial(parseInt(num));
            });

            // Replace math functions
            const angleConv = this.angleMode === 'deg' ? ' * Math.PI / 180' : '';
            expression = expression.replace(/sin\(/g, `Math.sin(`);
            expression = expression.replace(/cos\(/g, `Math.cos(`);
            expression = expression.replace(/tan\(/g, `Math.tan(`);
            expression = expression.replace(/asin\(/g, `Math.asin(`);
            expression = expression.replace(/acos\(/g, `Math.acos(`);
            expression = expression.replace(/atan\(/g, `Math.atan(`);
            expression = expression.replace(/log\(/g, 'Math.log10(');
            expression = expression.replace(/ln\(/g, 'Math.log(');
            expression = expression.replace(/sqrt\(/g, 'Math.sqrt(');

            const result = eval(expression);
            this.result = this.formatResult(result);
            this.lastAnswer = result;

            this.addToHistory(this.currentInput, this.result);
            this.updateDisplay();

        } catch (error) {
            this.result = 'Error';
            this.updateDisplay();
            setTimeout(() => {
                this.result = '0';
                this.updateDisplay();
            }, 2000);
        }
    }

    factorial(n) {
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    formatResult(num) {
        if (typeof num === 'string') return num;
        if (isNaN(num) || !isFinite(num)) return 'Error';
        
        const rounded = Math.round(num * 10000000000) / 10000000000;
        
        if (Math.abs(rounded) > 1e10 || (Math.abs(rounded) < 1e-6 && rounded !== 0)) {
            return rounded.toExponential(6);
        }
        
        return rounded.toString();
    }

    updateDisplay() {
        document.getElementById('displayInput').textContent = this.currentInput || '';
        document.getElementById('displayResult').textContent = this.result;
    }

    // ============ HISTORY ============
    setupHistory() {
        document.getElementById('clearHistory').addEventListener('click', () => {
            if (confirm('Clear all history?')) {
                this.history = [];
                this.saveHistory();
                this.renderHistory();
            }
        });
    }

    loadHistory() {
        const saved = localStorage.getItem('calculatorHistory');
        if (saved) {
            this.history = JSON.parse(saved);
            this.renderHistory();
        }
    }

    saveHistory() {
        localStorage.setItem('calculatorHistory', JSON.stringify(this.history));
    }

    addToHistory(expression, result) {
        this.history.unshift({ 
            expression, 
            result, 
            timestamp: new Date().toLocaleString() 
        });
        
        if (this.history.length > 50) this.history.pop();
        
        this.saveHistory();
        this.renderHistory();
    }

    renderHistory() {
        const list = document.getElementById('historyList');
        
        if (this.history.length === 0) {
            list.innerHTML = '<div class="history-empty">No calculations yet</div>';
            return;
        }

        list.innerHTML = this.history.map(item => `
            <div class="history-item">
                <div><strong>${item.expression}</strong> = ${item.result}</div>
                <small style="opacity: 0.7; font-size: 12px;">${item.timestamp}</small>
            </div>
        `).join('');
    }

    // ============ FORMULAS ============
    initializeFormulas() {
        return {
            mathematics: {
                quadratic: {
                    name: 'Quadratic Formula',
                    grade: '10-12',
                    inputs: [
                        { label: 'a (coefficient of x²)', id: 'a' },
                        { label: 'b (coefficient of x)', id: 'b' },
                        { label: 'c (constant)', id: 'c' }
                    ],
                    formula: 'x = (-b ± √(b²-4ac)) / 2a',
                    calculate: (v) => {
                        const disc = v.b * v.b - 4 * v.a * v.c;
                        if (disc < 0) return 'No real roots';
                        const x1 = (-v.b + Math.sqrt(disc)) / (2 * v.a);
                        const x2 = (-v.b - Math.sqrt(disc)) / (2 * v.a);
                        return `x₁ = ${x1.toFixed(4)}, x₂ = ${x2.toFixed(4)}`;
                    }
                },
                distance: {
                    name: 'Distance Formula',
                    grade: '9-10',
                    inputs: [
                        { label: 'x₁', id: 'x1' },
                        { label: 'y₁', id: 'y1' },
                        { label: 'x₂', id: 'x2' },
                        { label: 'y₂', id: 'y2' }
                    ],
                    formula: '√((x₂-x₁)² + (y₂-y₁)²)',
                    calculate: (v) => Math.sqrt(Math.pow(v.x2 - v.x1, 2) + Math.pow(v.y2 - v.y1, 2))
                },
                slope: {
                    name: 'Slope of Line',
                    grade: '8-10',
                    inputs: [
                        { label: 'x₁', id: 'x1' },
                        { label: 'y₁', id: 'y1' },
                        { label: 'x₂', id: 'x2' },
                        { label: 'y₂', id: 'y2' }
                    ],
                    formula: 'm = (y₂ - y₁) / (x₂ - x₁)',
                    calculate: (v) => (v.y2 - v.y1) / (v.x2 - v.x1)
                }
            },
            physics: {
                speed: {
                    name: 'Speed',
                    grade: '6-9',
                    inputs: [
                        { label: 'Distance (m)', id: 'distance' },
                        { label: 'Time (s)', id: 'time' }
                    ],
                    formula: 'v = d / t',
                    calculate: (v) => v.distance / v.time
                },
                force: {
                    name: 'Force (F = ma)',
                    grade: '9-11',
                    inputs: [
                        { label: 'Mass (kg)', id: 'm' },
                        { label: 'Acceleration (m/s²)', id: 'a' }
                    ],
                    formula: 'F = m × a',
                    calculate: (v) => v.m * v.a
                },
                kineticEnergy: {
                    name: 'Kinetic Energy',
                    grade: '9-11',
                    inputs: [
                        { label: 'Mass (kg)', id: 'm' },
                        { label: 'Velocity (m/s)', id: 'v' }
                    ],
                    formula: 'KE = ½mv²',
                    calculate: (v) => 0.5 * v.m * v.v * v.v
                },
                ohmsLaw: {
                    name: 'Ohm\'s Law',
                    grade: '10-12',
                    inputs: [
                        { label: 'Current (A)', id: 'i' },
                        { label: 'Resistance (Ω)', id: 'r' }
                    ],
                    formula: 'V = I × R',
                    calculate: (v) => v.i * v.r
                }
            },
            chemistry: {
                moles: {
                    name: 'Moles',
                    grade: '9-11',
                    inputs: [
                        { label: 'Mass (g)', id: 'mass' },
                        { label: 'Molar Mass (g/mol)', id: 'molarMass' }
                    ],
                    formula: 'n = m / M',
                    calculate: (v) => v.mass / v.molarMass
                },
                density: {
                    name: 'Density',
                    grade: '8-10',
                    inputs: [
                        { label: 'Mass (g)', id: 'mass' },
                        { label: 'Volume (cm³)', id: 'volume' }
                    ],
                    formula: 'ρ = m / V',
                    calculate: (v) => v.mass / v.volume
                },
                pH: {
                    name: 'pH Calculation',
                    grade: '11-12',
                    inputs: [
                        { label: 'H⁺ Concentration (mol/L)', id: 'h' }
                    ],
                    formula: 'pH = -log₁₀[H⁺]',
                    calculate: (v) => -Math.log10(v.h)
                }
            },
            commerce: {
                simpleInterest: {
                    name: 'Simple Interest',
                    grade: '7-10',
                    inputs: [
                        { label: 'Principal (₹)', id: 'p' },
                        { label: 'Rate (% per annum)', id: 'r' },
                        { label: 'Time (years)', id: 't' }
                    ],
                    formula: 'SI = (P × R × T) / 100',
                    calculate: (v) => (v.p * v.r * v.t) / 100
                },
                compoundInterest: {
                    name: 'Compound Interest',
                    grade: '8-12',
                    inputs: [
                        { label: 'Principal (₹)', id: 'p' },
                        { label: 'Rate (% per annum)', id: 'r' },
                        { label: 'Time (years)', id: 't' },
                        { label: 'Compounds per year', id: 'n' }
                    ],
                    formula: 'CI = P(1 + r/100n)^(nt) - P',
                    calculate: (v) => {
                        const amount = v.p * Math.pow(1 + v.r / (100 * v.n), v.n * v.t);
                        return amount - v.p;
                    }
                },
                profit: {
                    name: 'Profit/Loss',
                    grade: '6-9',
                    inputs: [
                        { label: 'Cost Price (₹)', id: 'cp' },
                        { label: 'Selling Price (₹)', id: 'sp' }
                    ],
                    formula: 'Profit = SP - CP',
                    calculate: (v) => v.sp - v.cp
                },
                profitPercent: {
                    name: 'Profit %',
                    grade: '7-10',
                    inputs: [
                        { label: 'Cost Price (₹)', id: 'cp' },
                        { label: 'Selling Price (₹)', id: 'sp' }
                    ],
                    formula: 'Profit% = ((SP - CP) / CP) × 100',
                    calculate: (v) => ((v.sp - v.cp) / v.cp) * 100
                }
            },
            geometry: {
                circleArea: {
                    name: 'Area of Circle',
                    grade: '6-8',
                    inputs: [
                        { label: 'Radius (r)', id: 'r' }
                    ],
                    formula: 'A = πr²',
                    calculate: (v) => Math.PI * v.r * v.r
                },
                rectangleArea: {
                    name: 'Area of Rectangle',
                    grade: '5-7',
                    inputs: [
                        { label: 'Length', id: 'l' },
                        { label: 'Width', id: 'w' }
                    ],
                    formula: 'A = l × w',
                    calculate: (v) => v.l * v.w
                },
                triangleArea: {
                    name: 'Area of Triangle',
                    grade: '6-8',
                    inputs: [
                        { label: 'Base', id: 'b' },
                        { label: 'Height', id: 'h' }
                    ],
                    formula: 'A = ½ × b × h',
                    calculate: (v) => 0.5 * v.b * v.h
                },
                sphereVolume: {
                    name: 'Volume of Sphere',
                    grade: '9-10',
                    inputs: [
                        { label: 'Radius (r)', id: 'r' }
                    ],
                    formula: 'V = (4/3)πr³',
                    calculate: (v) => (4/3) * Math.PI * Math.pow(v.r, 3)
                },
                pythagorean: {
                    name: 'Pythagorean Theorem',
                    grade: '8-10',
                    inputs: [
                        { label: 'Side a', id: 'a' },
                        { label: 'Side b', id: 'b' }
                    ],
                    formula: 'c = √(a² + b²)',
                    calculate: (v) => Math.sqrt(v.a * v.a + v.b * v.b)
                }
            }
        };
    }

    setupFormulas() {
        const subjectSelect = document.getElementById('subjectSelect');
        const formulaSelect = document.getElementById('formulaSelect');
        const inputsContainer = document.getElementById('formulaInputs');

        subjectSelect.addEventListener('change', () => {
            const subject = subjectSelect.value;
            
            if (!subject) {
                formulaSelect.innerHTML = '<option value="">First select a subject...</option>';
                inputsContainer.innerHTML = '';
                return;
            }

            const formulas = this.formulas[subject];
            let options = '<option value="">Select a formula...</option>';
            
            for (const [key, formula] of Object.entries(formulas)) {
                options += `<option value="${subject}:${key}">${formula.name} (Class ${formula.grade})</option>`;
            }
            
            formulaSelect.innerHTML = options;
            inputsContainer.innerHTML = '';
        });

        formulaSelect.addEventListener('change', () => {
            const value = formulaSelect.value;
            
            if (!value) {
                inputsContainer.innerHTML = '';
                return;
            }

            const [subject, formulaKey] = value.split(':');
            const formula = this.formulas[subject][formulaKey];
            
            let html = `
                <div class="formula-info">
                    <strong>Formula: ${formula.formula}</strong>
                    <div style="margin-top: 8px;">Grade Level: ${formula.grade}</div>
                </div>
            `;
            
            formula.inputs.forEach(input => {
                html += `
                    <div class="input-group">
                        <label>${input.label}</label>
                        <input type="number" step="any" id="${input.id}" 
                               placeholder="Enter ${input.label.toLowerCase()}">
                    </div>
                `;
            });
            
            html += '<button class="formula-calculate" id="formulaCalcBtn">Calculate Result</button>';
            inputsContainer.innerHTML = html;

            document.getElementById('formulaCalcBtn').addEventListener('click', () => {
                const values = {};
                let valid = true;

                formula.inputs.forEach(input => {
                    const element = document.getElementById(input.id);
                    const value = parseFloat(element.value);
                    if (element.value === '' || isNaN(value)) {
                        valid = false;
                    } else {
                        values[input.id] = value;
                    }
                });

                if (valid) {
                    const result = formula.calculate(values);
                    this.result = this.formatResult(result);
                    
                    const inputStr = formula.inputs.map(inp => 
                        `${inp.label}: ${values[inp.id]}`
                    ).join(', ');
                    
                    this.addToHistory(`${formula.name} (${inputStr})`, this.result);
                    this.currentInput = formula.formula;
                    this.updateDisplay();
                } else {
                    alert('⚠️ Please fill in all fields with valid numbers');
                }
            });
        });
    }
}

// Initialize Calculator when page loads
document.addEventListener('DOMContentLoaded', () => {
    const calculator = new Calculator();
    console.log('🧮 Premium Calculator initialized successfully!');
});
