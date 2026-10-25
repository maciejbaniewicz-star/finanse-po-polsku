// Kalkulator podatku: skala podatkowa (art. 27 PIT) i liniowy 19% (art. 30c PIT). Wynik orientacyjny.
(function () {
  var form = document.getElementById('calc-form');
  if (!form) return;

  var LIMIT_ZDROWOTNA_LINIOWY = 14100;
  var STAWKA_ZDROWOTNA = 0.09;

  var fmt = function (n) {
    return n.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' zł';
  };

  var podatekSkala = function (base) {
    if (base <= 0) return 0;
    if (base <= 120000) return Math.max(0, 0.12 * base - 3600);
    return 10800 + 0.32 * (base - 120000);
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var dochod = parseFloat(document.getElementById('dochod').value);
    var zus = parseFloat(document.getElementById('zus').value) || 0;
    var forma = document.getElementById('forma').value;
    var out = document.getElementById('wynik');

    if (!(dochod > 0) || zus < 0) {
      out.innerHTML = '<p>Wpisz dochód większy od zera oraz składki ZUS nieujemne.</p>';
      return;
    }

    var przedSkladkami = Math.max(0, dochod - zus);
    var zdrowotna = STAWKA_ZDROWOTNA * przedSkladkami;
    var podstawa;
    var podatek;

    if (forma === 'skala') {
      podstawa = przedSkladkami;
      podatek = podatekSkala(podstawa);
    } else {
      var odliczenie = Math.min(zdrowotna, LIMIT_ZDROWOTNA_LINIOWY);
      podstawa = Math.max(0, przedSkladkami - odliczenie);
      podatek = 0.19 * podstawa;
    }

    var netto = dochod - zus - zdrowotna - podatek;
    var efektywna = (podatek / dochod) * 100;

    out.innerHTML =
      '<dl class="result">' +
      '<dt>Podstawa opodatkowania</dt><dd>' + fmt(podstawa) + '</dd>' +
      '<dt>Podatek dochodowy (PIT)</dt><dd>' + fmt(podatek) + '</dd>' +
      '<dt>Składka zdrowotna (9%)</dt><dd>' + fmt(zdrowotna) + '</dd>' +
      '<dt>Na rękę (rocznie, orientacyjnie)</dt><dd>' + fmt(netto) + '</dd>' +
      '<dt>Efektywna stawka PIT</dt><dd>' + efektywna.toLocaleString('pl-PL', { maximumFractionDigits: 2 }) + '%</dd>' +
      '</dl>' +
      '<p class="meta">Wynik roczny, orientacyjny. Nie uwzględnia kosztów uzyskania przychodu, ulg ani zaliczek w ciągu roku.</p>';
  });
})();
