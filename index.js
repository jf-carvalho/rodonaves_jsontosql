const fs = require('fs');

fs.readFile('./tabela.json', function read(err, data) {
    if (err) {
        throw err;
    }
    const content = data;

    processFile(content);
});

function processFile(content) {
    const json = JSON.parse(content);

    let output = "INSERT INTO oc_setting (store_id, code, key, value, serialized) VALUES";
    var aux = {};

    const code = 'shipping_frete_customizado';
    const key = 'shipping_frete_customizado_fretes';

    console.log("Starting JSON iteration...")

    var old_value = '';

    json.forEach((chunk) => {
    	chunk.forEach((element) => {
    		let value;
    		if(typeof element.Cidade !== 'undefined'){
    			aux.title = ""+element['Cidade'].replace('\'','')+"";
    			aux.total = ""+element['Frete'].toFixed(2)+"";
    			aux.minimum = "";
    			aux.start_zipcode = ""+element['CEP Inicial']+"";
    			aux.end_zipcode = ""+element['CEP Final']+"";
    			aux.start_weight = ""+element['Peso Mínimo']+"";
    			aux.end_weight = ""+element['Peso Máximo']+"";
    			aux.tempo_estimado = ""+element['Lead Time']+"";
    		}

    		value = JSON.stringify(aux);

            if(value !== old_value){
                output += `\n (0, '${code}', '${key}', '${value}', 1),`
                old_value = '';
            }
            
            old_value = value;
            
    	})
    })

    console.log("Finished JSON iteration.");

    console.log('Starting writing SQL file...')

    output = output.replace(/.$/,";")

    fs.writeFile('fretes.sql', output, (err) => {
      if (err) return console.error('\x1b[31m%s\x1b[0m',err);
      console.log('\x1b[32m%s\x1b[0m',"\nSQL file successfully created.");
    });
}