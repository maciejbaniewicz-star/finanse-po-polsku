// Kalkulator odsetek od oszczędności (proste i składane, podatek 19%). Wynik orientacyjny.
(function () {
  var form = document.getElementById('calc-form');
  if (!form) return;

  var fmt = function (n) {
    return n.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' zł';
  };

  // m = liczba kapitalizacji w roku (0 = brak, odsetki proste).
  function oblicz(K, rocznie, n, m) {
    var r = rocznie / 100;
    var kwota, efektywna;
    if (m === 0) {
      kwota = K * (1 + r * n / 12);
      efektywna = r;
    } else {
      var p = 12 / m;
      var f = Math.floor(n / p);
      var rem = n - f * p;
      kwota = K * Math.pow(1 + r / m, f) * (1 + r * rem / 12);
      efektywna = Math.pow(1 + r / m, m) - 1;
    }
    var odsetkiBrutto = kwota - K;
    var podatek = odsetkiBrutto * 0.19;
    var odsetkiNetto = odsetkiBrutto - podatek;
    return {
      odsetkiBrutto: odsetkiBrutto,
      podatek: podatek,
      odsetkiNetto: odsetkiNetto,
      kapitalNetto: K + odsetkiNetto,
      efektywna: efektywna
    };
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var kapital = parseFloat(document.getElementById('kwota').value);
    var oprocentowanie = parseFloat(document.getElementById('oprocentowanie').value);
    var n = parseInt(document.getElementById('okres').value, 10);
    var m = parseInt(document.getElementById('kapitalizacja').value, 10);

    var out = document.getElementById('wynik');

    if (!(kapital > 0) || !(n > 0) || isNaN(oprocentowanie) || oprocentowanie < 0) {
      out.innerHTML = '<p>Wpisz poprawne wartości: kwotę większą od zera, okres w miesiącach i oprocentowanie nieujemne.</p>';
      return;
    }

    var w = oblicz(kapital, oprocentowanie, n, m);

    out.innerHTML =
      '<dl class="result">' +
      '<dt>Odsetki brutto</dt><dd>' + fmt(w.odsetkiBrutto) + '</dd>' +
      '<dt>Podatek 19%</dt><dd>' + fmt(w.podatek) + '</dd>' +
      '<dt>Odsetki netto</dt><dd>' + fmt(w.odsetkiNetto) + '</dd>' +
      '<dt>Kapitał z odsetkami netto</dt><dd>' + fmt(w.kapitalNetto) + '</dd>' +
      '<dt>Efektywne roczne oprocentowanie brutto</dt><dd>' + (w.efektywna * 100).toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%</dd>' +
      '</dl>' +
      '<p class="meta">Wynik nie uwzględnia zmian stóp w czasie, inflacji ani zasad banku dotyczących bazy naliczania. Nie jest poradą finansową.</p>';
  });
})();
