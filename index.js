const fs = require('fs');

fs.readFile('./tabela.json', function read(err, data) {
    if (err) {
        throw err;
    }
    const content = data;

    processFile(content);
});

const processFile = (content) => {
    const json = JSON.parse(content)[0];
    var count = 0;

    let output = `INSERT INTO oc_faixas_rodonaves (title, total, start_zipcode, end_zipcode, peso_minimo, peso_maximo, tempo_estimado) VALUES`;

    console.log("Starting JSON iteration...");

    json.forEach((res) => {
        res.valor = res.valor.toFixed(2);
        res.cidade = res.cidade.replace('\'', '\\\'');
        output += `\n('${res.cidade}', ${res.valor}, '${res.cep_inicial}', '${res.cep_final}', ${res.peso_minimo}, ${res.peso_maximo}, ${res.tempo_estimado}),`;          
        count++;
    })

    console.log("Finished JSON iteration.");

    console.log('Start writing SQL file...');

    output = output.slice(0, -1) + ';';

    fs.writeFile('fretes.sql', output, (err) => {
      if (err) return console.error('\x1b[31m%s\x1b[0m',err);
      console.log('\x1b[32m%s\x1b[0m',`\nSQL file successfully created. ${count} rows.`);
    });
}
