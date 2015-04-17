var Loader = {};

(function() {

  // Removed in 2014: losinyj
  var Stations = 'rogovo troitsk kapotnya golovacheva kozuhovskaya shabol spirid kazak biryulevo chayanova butlerova cheremushki gagrina marin gurevsk lyublino hamovniki kosino kojuhovo polyarnaya ostankino madi maslovka dolgoprud letnaya turist mgu kutuz_2 zelen_11 zelen_15 zelen_6 veshnyaki zvenigorod chura suhar scherbinka semenkovo salarevo proletarskiy guryanova'.split(' ');

  var Factors = {
    'Среднее значение (в мг / куб. м)'                      : 'avg_mg',       // 1
    'Среднее значение (в ПДК с.с.)'                         : 'avg_pdk_ss',   // 2
    'Максимальное разовое значение (в мг / куб. м)'         : 'max_mg',       // 3
    'Максимальное разовое значение (в ПДК м.р.)'            : 'max_pdk',      // 4
    'Максимальное разовое значение — дата и время'          : '',             // 5
    'Максимальное среднесуточное значение (в мг / куб. м)'  : 'max_mg_ss',    // 6
    'Максимальное среднесуточное значение (в ПДК с.с.)'     : 'max_pdk_ss',   // 7
    'Максимальное среднесуточное значение — дата'           : '',             // 8
    'Превышение ПДК м.р. (часы)'                            : 'raise_pdk_mr', // 9
    'Наибольшая длительность непрерывного превышения ПДК м.р. (часы)'  : 'raise_time_pdk',   // 10
    'Превышение ПДК с.с. (сутки)'                           : 'raise_pdk_ss', // 11
    'Наибольшая длительность непрерывного превышения ПДК с.с. (сутки)' : 'raise_time_pdk_ss' // 12
  };

  var Indexes = {
    'Оксид углерода'                    : 'oxid-ugleroda',
    'Диоксид серы'                      : 'dioxid-seri',
    'Сероводород'                       : 'serovodorod',
    'Метан'                             : 'metan',
    'Неметановые углеводороды'          : 'non-metan-ugevodorodi',
    'Углеводороды суммарные'            : 'uglevodorodi',
    'Диоксид азота'                     : 'dioxid-seri',
    'Оксид азота'                       : 'oxid-azota',
    'Аммиак'                            : 'amiak',
    'Озон'                              : 'ozon',
    'Формальдегид'                      : 'formaldegid',
    'Бензол'                            : 'benzol',
    'Толуол'                            : 'toluol',
    'Параксилол'                        : 'paraxilol',
    'Фенол'                             : 'fenol',
    'Стирол'                            : 'stirol',
    'SO2_OPSIS'                         : 'SO2_OPSIS',
    'Взвешенные частицы менее 10 мкм'   : 'chastitsi-10',
    'Взвешенные частицы менее 2.5 мкм'  : 'chastitsi-2',
    'Азотистая кислота'                 : 'azotistaya-kislota',
    'Нафталин'                          : 'naftalin',
    'Метаксилол'                        : 'metaksilol',
    'Этилбензол'                        : 'etilbenzol',
    'H2S'                               : 'H2S'
  };

  $.extend(Loader, {
    loadAsync: false,
    dataDir: 'data_2014',
    dataColumn: 'data',
    separator: ';',

    createCsv: function (factor) {
      console.info('factor', _.keys(Factors)[factor - 1]);
      var self = this, csv = '';
      var indexes = self.parseAllIndexes();
      var keys = _.map(indexes, function(index) {
          return self.dataColumn + '.' + (Indexes[index] || index) + '.' + _.values(Factors)[factor - 1]; }
      );
      //csv += self.createCsvRow('', indexes);
      csv += self.createCsvRow('moseco_id', keys);
      self.eachFile(function (data, station) {
        var row = new Array(indexes.length);
        $(data).find('tr.evenarg, tr.oddarg').each(function () {
          var index = $(this).find('td:first').text();
          var value = $(this).find('td').eq(factor).text();
          var i = indexes.indexOf(index);
          if (i > -1)
            row[i] = value;
        });
        //console.info(station, row);
        csv += self.createCsvRow(station, row);
      });
      return csv;
    },

    parseAllIndexes: function () {
      var self = this, indexes = [];
      self.eachFile(function (data) {
        $(data).find('tr.evenarg, tr.oddarg').each(function () {
          var index = $(this).find('td:first').text();
          if (indexes.indexOf(index) < 0)
            indexes.push(index);
        });
      });
      console.info("all indexes", indexes);
      return indexes;
    },

    eachFile: function (callback) {
      var self = this;
      $.each(Stations, function (i, station) {
        var path = self.dataDir + '/' + station + '.html';
        self.loadFile(path, function (data) {
          callback(data, station);
        });
      });
    },

    loadFile: function (path, callback) {
      $.ajax({
        url: path,
        dataType: "html",
        async: this.loadAsync
      }).done(function (data) {
        if (!data)
          console.error("[LoadFile] File is empty by path ", path);
        callback(data);
      }).fail(function () {
        console.error("[LoadFile] Cannot load a file by path ", path);
      });
    },

    createCsvRow: function (first, others) {
      var self = this, csv = first;
      $.each(others, function (i, other) {
        csv += self.separator + (!!other && other != '—' ? other : '');
      });
      csv += '\n';
      return csv;
    }
  });

})();
