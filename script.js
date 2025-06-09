// --- Setup: Data and state ---
const bundleConfigs = [
  {
    units: 1,
    price: 10.0,
    oldPrice: 24.0,
    discount: '10% Off',
    options: [
      { size: 'S', color: 'Black' }
    ],
    showOptions: false,
  },
  {
    units: 2,
    price: 18.0,
    oldPrice: 24.0,
    discount: '20% Off',
    options: [
      { size: 'S', color: 'Black' },
      { size: 'S', color: '' },
    ],
    showOptions: true,
  },
  {
    units: 3,
    price: 24.0,
    oldPrice: 24.0,
    discount: '30% Off',
    options: [
      { size: 'S', color: '' },
      { size: 'S', color: '' },
      { size: 'S', color: '' },
    ],
    showOptions: true,
  }
];

const SIZES = ['S', 'M', 'L', 'XL'];
const COLORS = ['Black', 'White', 'Red', 'Blue', 'Green', 'Colour'];

let selectedBundleIndex = 0;

// --- Utility functions ---
function $(sel) { return document.querySelector(sel); }
function $all(sel) { return document.querySelectorAll(sel); }

// --- Main logic ---
document.addEventListener('DOMContentLoaded', () => {
  const form = $('#bogoForm');
  const boxElems = $all('.bogo-box');
  const delivery = $('.bogo-delivery');
  const totalAmount = $('.bogo-total-amount');

  // Initialize expand/collapse
  boxElems.forEach((box, i) => {
    // Clicking the box or radio expands it
    box.addEventListener('click', (e) => {
      // avoid double fire on radio
      if(e.target.type === 'radio' || box.contains(e.target)) {
        expandBox(i);
      }
    });
    // Make radio clickable directly
    const radio = box.querySelector('input[type=radio]');
    radio.addEventListener('change', () => expandBox(i));
  });

  function expandBox(idx) {
    boxElems.forEach((box, i) => {
      if (i === idx) {
        box.classList.add('expanded');
        box.querySelector('input[type=radio]').checked = true;
        selectedBundleIndex = idx;
        updateOptions(idx);
      } else {
        box.classList.remove('expanded');
      }
    });
    updateDeliveryAndTotal();
  }

  function updateOptions(idx) {
    // For humanizing, we generate selects only if bundle has showOptions true and units > 1
    boxElems.forEach((box, i) => {
      const optDiv = box.querySelector('.bogo-options');
      if (bundleConfigs[i].units > 1 && box.classList.contains('expanded')) {
        // Build table
        let html = '<div class="bogo-table">';
        html += '<div class="bogo-table-row">'
              + '<div class="bogo-table-header">Size</div>'
              + '<div class="bogo-table-header">Colour</div>'
              + '</div>';
        for (let j = 0; j < bundleConfigs[i].units; ++j) {
          html += '<div class="bogo-table-row">';
          html += `<div class="bogo-table-cell">
            <select data-opt="size" data-idx="${j}">
              ${SIZES.map(sz=>`<option value="${sz}">${sz}</option>`).join('')}
            </select>
          </div>`;
          html += `<div class="bogo-table-cell">
            <select data-opt="color" data-idx="${j}">
              ${COLORS.map(clr=>`<option value="${clr}">${clr}</option>`).join('')}
            </select>
          </div>`;
          html += '</div>';
        }
        html += '</div>';
        optDiv.innerHTML = html;
        // Setup event listeners
        optDiv.querySelectorAll('select').forEach(sel => {
          sel.addEventListener('change', (e) => {
            const k = +sel.getAttribute('data-idx');
            const t = sel.getAttribute('data-opt');
            bundleConfigs[i].options[k][t] = sel.value;
          });
        });
      } else {
        optDiv.innerHTML = '';
      }
    });
  }

  function updateDeliveryAndTotal() {
    const bundle = bundleConfigs[selectedBundleIndex];
    totalAmount.textContent = `$${bundle.price.toFixed(2)} USD`;
    if(bundle.units > 1) {
      delivery.style.display = 'block';
    } else {
      delivery.style.display = 'none';
    }
  }

  // Initial state: expand 1st
  expandBox(0);

  // Form submission handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const bundle = bundleConfigs[selectedBundleIndex];
    alert(`Added ${bundle.units} Unit(s) to cart!`);
  });
});
