// Kalkulator kosztu kredytu (rata annuitetowa). Wynik orientacyjny, nie RRSO.
(function () {
  var form = document.getElementById('calc-form');
  if (!form) return;

  var fmt = function (n) {
    return n.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' zł';
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var kapital = parseFloat(document.getElementById('kwota').value);
    var rocznie = parseFloat(document.getElementById('oprocentowanie').value) / 100;
    var n = parseInt(document.getElementById('okres').value, 10);
    var prowizjaProc = parseFloat(document.getElementById('prowizja').value) / 100 || 0;

    var out = document.getElementById('wynik');

    if (!(kapital > 0) || !(n > 0) || isNaN(rocznie) || rocznie < 0) {
      out.innerHTML = '<p>Wpisz poprawne wartości: kwotę większą od zera, okres w miesiącach i oprocentowanie nieujemne.</p>';
      return;
    }

    var r = rocznie / 12;
    var rata = r === 0 ? kapital / n : kapital * r / (1 - Math.pow(1 + r, -n));
    var sumaRat = rata * n;
    var prowizja = kapital * prowizjaProc;
    var kosztCalkowity = (sumaRat - kapital) + prowizja;

    out.innerHTML =
      '<dl class="result">' +
      '<dt>Miesięczna rata (orientacyjnie)</dt><dd>' + fmt(rata) + '</dd>' +
      '<dt>Suma rat</dt><dd>' + fmt(sumaRat) + '</dd>' +
      '<dt>Prowizja</dt><dd>' + fmt(prowizja) + '</dd>' +
      '<dt>Koszt kredytu (odsetki + prowizja)</dt><dd>' + fmt(kosztCalkowity) + '</dd>' +
      '</dl>' +
      '<p class="meta">Wynik nie uwzględnia ubezpieczeń ani innych opłat i nie jest RRSO. Sprawdź wartości w umowie.</p>';
  });
})();
