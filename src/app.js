let witnessChart = null;
let timeChart = null;

function initializeCharts() {
  // Guvohlar grafigi
  const witnessCtx = document.getElementById("witnessChart").getContext("2d");
  witnessChart = new Chart(witnessCtx, {
    type: "bar",
    data: {
      labels: [],
      datasets: [],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Guvohlar soni",
          },
        },
      },
    },
  });

  // Vaqt grafigi
  const timeCtx = document.getElementById("timeChart").getContext("2d");
  timeChart = new Chart(timeCtx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Bajarilish vaqti (ms)",
          data: [],
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Vaqt (ms)",
          },
        },
      },
    },
  });
}

function updateCharts(results) {
  // Guvohlar grafikini yangilash
  const witnessData = {
    labels: results.map((r) => r.method),
    datasets: [
      {
        label: "Jami guvohlar",
        data: results.map((r) => r.witnesses.length),
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
      {
        label: "Muvaffaqiyatli guvohlar",
        data: results.map((r) => r.witnesses.filter((w) => w.passes).length),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
    ],
  };

  witnessChart.data = witnessData;
  witnessChart.update();

  // Vaqt grafikini yangilash
  const timeData = {
    labels: results.map((r) => r.method),
    datasets: [
      {
        label: "Bajarilish vaqti (ms)",
        data: results.map((r) => parseFloat(r.time)),
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  timeChart.data = timeData;
  timeChart.update();
}

document.addEventListener("DOMContentLoaded", function () {
  const numberInput = document.getElementById("numberInput");
  const largeNumberInput = document.getElementById("largeNumberInput");
  const checkButton = document.getElementById("checkButton");
  const checkLargeButton = document.getElementById("checkLargeButton");
  const resultsContainer = document.getElementById("results");
  const largeNumberResult = document.getElementById("largeNumberResult");
  const modeToggle = document.getElementById("largeNumberMode");
  const standardInputGroup = document.getElementById("standardInputGroup");
  const largeInputGroup = document.getElementById("largeInputGroup");
  const standardResults = document.getElementById("standardResults");
  const largeResults = document.getElementById("largeResults");

  function createIcon(isSuccess) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" 
          class="${isSuccess ? "success-icon" : "error-icon"}">
          ${
            isSuccess
              ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>'
              : '<circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line>'
          }
      </svg>
    `;
  }

  function getWitnesses(n, method) {
    let witnesses = [];
    const k = 5;

    switch (method) {
      case "Fermat":
        for (let i = 0; i < k; i++) {
          const a = 2 + Math.floor(Math.random() * (n - 4));
          const isPassing = PrimeTest.modularPow(a, n - 1, n) === 1;
          witnesses.push({
            base: a,
            passes: isPassing,
            explanation: `${a}^(${n}-1) mod ${n} = ${PrimeTest.modularPow(
              a,
              n - 1,
              n
            )}`,
          });
        }
        break;

      case "Solovay-Strassen":
        for (let i = 0; i < k; i++) {
          const a = 2 + Math.floor(Math.random() * (n - 4));
          const x = PrimeTest.modularPow(a, (n - 1) / 2, n);
          const jacobian = PrimeTest.calculateJacobian(a, n);
          const passes = x === jacobian || x === n + jacobian;
          witnesses.push({
            base: a,
            passes: passes,
            explanation: `Jacobian(${a}/${n}) = ${jacobian}, ${a}^((${n}-1)/2) mod ${n} = ${x}`,
          });
        }
        break;

      case "Miller-Rabin":
        let d = n - 1;
        let s = 0;
        while (d % 2 === 0) {
          d = Math.floor(d / 2);
          s++;
        }
        for (let i = 0; i < k; i++) {
          const a = 2 + Math.floor(Math.random() * (n - 4));
          const passes = PrimeTest.millerRabinSingleTest(n, d, s);
          witnesses.push({
            base: a,
            passes: passes,
            explanation: `Asos ${a}: ${
              passes ? "tub son guvoh" : "murakkab son guvoh"
            }`,
          });
        }
        break;

      case "AKS":
        for (let i = 2; i <= Math.min(Math.sqrt(n), 10); i++) {
          const passes = n % i !== 0;
          witnesses.push({
            base: i,
            passes: passes,
            explanation: `${n} % ${i} = ${n % i}`,
          });
        }
        break;
    }
    return witnesses;
  }

  function createWitnessesTable(witnesses) {
    return `
      <table class="witnesses-table">
          <thead>
              <tr>
                  <th>Asos</th>
                  <th>Natija</th>
                  <th>Tushuntirish</th>
              </tr>
          </thead>
          <tbody>
              ${witnesses
                .map(
                  (witness) => `
                  <tr>
                      <td>${witness.base}</td>
                      <td>${createIcon(witness.passes)}</td>
                      <td>${witness.explanation}</td>
                  </tr>
              `
                )
                .join("")}
          </tbody>
      </table>
    `;
  }

  function createResultCard(result) {
    return `
      <div class="result-card">
          <div class="result-header">
              ${createIcon(result.isPrime)}
              <h3 class="result-title">${result.method}</h3>
          </div>
          <div class="result-stats">
              <span class="stats-label" style="margin-left: 16px">Vaqt:</span>
              ${result.time}ms
          </div>
          <div>
              <h4 class="witnesses-title">Guvohlar:</h4>
              ${createWitnessesTable(result.witnesses)}
          </div>
      </div>
    `;
  }

  // Kichik sonlar uchun test
  async function runTests(num) {
    const testNum = parseInt(num);
    if (isNaN(testNum)) return;

    const testMethods = ["Fermat", "Solovay-Strassen", "Miller-Rabin", "AKS"];
    resultsContainer.innerHTML = "";
    const allResults = [];

    for (let method of testMethods) {
      const startTime = performance.now();
      let result;

      switch (method) {
        case "Fermat":
          result = PrimeTest.fermatTest(testNum);
          break;
        case "Solovay-Strassen":
          result = PrimeTest.solovayStrassenTest(testNum);
          break;
        case "Miller-Rabin":
          result = PrimeTest.millerRabinTest(testNum);
          break;
        case "AKS":
          result = PrimeTest.aksTest(testNum);
          break;
      }

      const endTime = performance.now();
      const witnesses = getWitnesses(testNum, method);

      const resultData = {
        method: method,
        isPrime: result.isPrime,
        confidence: result.confidence || 100,
        time: (endTime - startTime).toFixed(2),
        witnesses: witnesses,
      };

      allResults.push(resultData);
      resultsContainer.insertAdjacentHTML(
        "beforeend",
        createResultCard(resultData)
      );
    }

    updateCharts(allResults);
  }

  // Katta sonlar uchun test
  async function runLargeNumberTest(numStr) {
    try {
      const startTime = performance.now();

      // Probel va yangi qatorlarni olib tashlash
      numStr = numStr.replace(/\s+/g, "");

      // Validatsiya
      if (!/^\d+$/.test(numStr)) {
        throw new Error("Noto'g'ri son formati");
      }

      // primalityTest funksiyasini chaqirish
      const result = await primalityTest(numStr);
      const endTime = performance.now();
      const timeElapsed = (endTime - startTime).toFixed(2);

      // Natijani ko'rsatish
      largeNumberResult.innerHTML = `
        <div class="result-card">
          <div class="result-header">
            ${createIcon(result.probablePrime)}
            <h3 class="result-title">
              ${result.probablePrime ? "Tub son" : "Murakkab son"}
            </h3>
          </div>
          <div class="result-stats">
            <span class="stats-label">Vaqt:</span> ${timeElapsed}ms
          </div>
          <div class="result-details">
            <p>Son uzunligi: ${numStr.length} xona</p>
            <p>Test turi: ${result.method || "Miller-Rabin"}</p>
            ${
              result.certainty
                ? `<p>Ishonchlilik: ${result.certainty}%</p>`
                : ""
            }
            ${
              result.divisor
                ? `<p>Bo'luvchi topildi: ${result.divisor}</p>`
                : ""
            }
          </div>
          ${
            result.steps
              ? `
          <div class="test-steps">
            <h4>Test bosqichlari:</h4>
            <ul>
              ${result.steps.map((step) => `<li>${step}</li>`).join("")}
            </ul>
          </div>
          `
              : ""
          }
        </div>
      `;
    } catch (error) {
      largeNumberResult.innerHTML = `
        <div class="error-message">
          Xatolik: ${error.message}
        </div>
      `;
    }
  }

  // Mode toggle event listener
  modeToggle.addEventListener("change", function () {
    if (this.checked) {
      standardInputGroup.classList.add("hidden");
      standardResults.classList.add("hidden");
      largeInputGroup.classList.remove("hidden");
      largeResults.classList.remove("hidden");
    } else {
      standardInputGroup.classList.remove("hidden");
      standardResults.classList.remove("hidden");
      largeInputGroup.classList.add("hidden");
      largeResults.classList.add("hidden");
    }
  });

  // Event listeners
  checkButton.addEventListener("click", () => {
    runTests(numberInput.value);
  });

  checkLargeButton.addEventListener("click", () => {
    runLargeNumberTest(largeNumberInput.value);
  });

  numberInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      runTests(numberInput.value);
    }
  });

  largeNumberInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      runLargeNumberTest(largeNumberInput.value);
    }
  });
  const additionalStyles = `
  .test-steps {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #eee;
  }

  .test-steps h4 {
    margin: 0 0 12px 0;
    font-size: 16px;
    color: #333;
  }

  .test-steps ul {
    margin: 0;
    padding-left: 20px;
  }

  .test-steps li {
    margin-bottom: 8px;
    color: #666;
    font-size: 14px;
  }
`;

  // Add styles to document
  const styleSheet = document.createElement("style");
  styleSheet.textContent = additionalStyles;
  document.head.appendChild(styleSheet);
  // Initialize charts for standard mode
  initializeCharts();
});
