// Kalkulator zdolności kredytowej (orientacyjny). Wszystkie progi podaje użytkownik jako własne założenie.
(function () {
  var form = document.getElementById('zdol-form');
  if (!form) return;

  var fmt = function (n) {
    return n.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' zł';
  };
  var num = function (id) {
    var v = document.getElementById(id).value.trim();
    return v === '' ? NaN : parseFloat(v.replace(',', '.'));
  };
  var annuity = function (k, rocznie, n) {
    var r = rocznie / 12;
    return r === 0 ? k / n : k * r / (1 - Math.pow(1 + r, -n));
  };
  var kapitalZRaty = function (rata, rocznie, n) {
    var r = rocznie / 12;
    return r === 0 ? rata * n : rata * (1 - Math.pow(1 + r, -n)) / r;
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var out = document.getElementById('wynik-zdolnosc');

    var dochod = num('dochod');
    var wydatki = num('wydatki');
    var raty = num('raty');
    var kwota = num('kwota');
    var n = parseInt(document.getElementById('okres').value, 10);
    var rocznie = num('oprocentowanie') / 100;
    var progRaw = document.getElementById('prog').value.trim();
    var prog = progRaw === '' ? NaN : parseFloat(progRaw.replace(',', '.')) / 100;

    var poprawne = dochod > 0 && wydatki >= 0 && raty >= 0 && kwota > 0 && n > 0 && rocznie >= 0 &&
      (progRaw === '' || (prog > 0 && prog <= 1));
    if (!poprawne || isNaN(dochod) || isNaN(wydatki) || isNaN(raty) || isNaN(kwota) || isNaN(rocznie)) {
      out.innerHTML = '<p>Wpisz poprawne wartości: dochód większy od zera, wydatki i raty nieujemne, kwotę kredytu większą od zera, okres w miesiącach, oprocentowanie nieujemne. Próg, jeśli podajesz, musi być dodatni.</p>';
      return;
    }

    var rata = annuity(kwota, rocznie, n);
    var nadwyzka = dochod - wydatki - raty - rata;
    var obciazenie = (raty + rata) / dochod;

    var limitWydatki = Math.max(0, dochod - wydatki - raty);
    var maxRata = limitWydatki;
    var liniaProgu = '';
    if (!isNaN(prog)) {
      var limitProg = Math.max(0, prog * dochod - raty);
      maxRata = Math.min(limitWydatki, limitProg);
      liniaProgu = '<dt>Obciążenie po tym kredycie wobec Twojego progu</dt><dd>' +
        (obciazenie <= prog ? 'mieści się w progu' : 'przekracza próg') + ' (' + (obciazenie * 100).toFixed(2) + '% wobec ' + (prog * 100).toFixed(2) + '%)</dd>';
    }
    var maxKredyt = kapitalZRaty(maxRata, rocznie, n);

    var ostrzezenie = nadwyzka < 0 ? '<p><b>Uwaga:</b> przy tych danych rata przekracza środki po wydatkach i ratach.</p>' : '';
    var brakProgu = isNaN(prog) ? '<p class="meta">Nie podano progu. Wynik pokazuje tylko limit wynikający z wydatków.</p>' : '';

    out.innerHTML =
      '<dl class="result">' +
      '<dt>Rata nowego kredytu (annuitet, orientacyjnie)</dt><dd>' + fmt(rata) + '</dd>' +
      '<dt>Nadwyżka po wydatkach, ratach i nowej racie</dt><dd>' + fmt(nadwyzka) + '</dd>' +
      '<dt>Wskaźnik obciążenia dochodu (raty / dochód)</dt><dd>' + (obciazenie * 100).toFixed(2) + '%</dd>' +
      liniaProgu +
      '<dt>Maksymalna rata przy tych założeniach</dt><dd>' + fmt(maxRata) + '</dd>' +
      '<dt>Orientacyjna maksymalna kwota kredytu</dt><dd>' + fmt(maxKredyt) + '</dd>' +
      '</dl>' + ostrzezenie + brakProgu +
      '<p class="meta">Wynik jest orientacyjny. Nie jest oceną zdolności kredytowej, nie uwzględnia historii BIK ani polityki banku i nie jest RRSO.</p>';
  });
})();
