const fs = require('fs');
const path = require('path');

const sourFile = './temp.jso';
const outputFile = '/Users/zengxx/data/relations/riskcollections.csv';
const titleLine = '_key,type,name,description,from,to';

const writeLine2csv = (line) => {
  console.log('line:' + line);
  if (!line) {
    console.warn('null line, igoned');
  }
  fs.appendFileSync(outputFile, line+'\n', {encoding: 'utf8'});
};

const write2csv = (item) => {
    if(!item) {
      return;
    }

    let line = `${item._key},${item.type},,,`;
    if (item.from && item.to) {
      line = line + `${item.from},${item.to}`;
    } else {
      line = line + ',,'
    }

    //
    writeLine2csv(line);
};

const append2csvByBatch = (items) => {
  items.map(item=>{
    return write2csv(item);
  });
}

const pickGraphs = (graphs) => {
    return graphs.map(graph => {
        return {_key: graph._key, type: 101};
    });
}

const pickVertexes = (graphs) => {
    const nodes = [];
    graphs.map(graph => {
        graph.orphanCollections.map(vname => {
          nodes.push({_key: vname, type: 2});
        });
    });

    return nodes;
}

const pickEdges = (graphs) => {
    const edges = [];
    graphs.map(graph => {
        graph.edgeDefinitions.map(edgeInfo => {
            edges.push({_key: edgeInfo.collection, type: 3, from: edgeInfo.from[0], to: edgeInfo.to[0]});
        })
    });

    return edges;
};

// main entry

// backup old file
if (fs.existsSync(outputFile)) {
  const pathParts = sourFile.split('/');
  const fileName = pathParts[pathParts.length - 1];
  const now = new Date();
  const newFilePath = path.dirname(outputFile) + `/.bak/${path.basename(outputFile)}.${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
  fs.renameSync(outputFile, newFilePath);
}

fs.readFile('./temp.json',  'utf8', (err, data) => {
      if(err) throw err;
      if(data.error) {
        console.error('http request failed');
      }

      console.warn(data);
      const graphs = JSON.parse(data).graphs;
      writeLine2csv(titleLine);
      append2csvByBatch(pickGraphs(graphs));
      append2csvByBatch(pickVertexes(graphs));
      append2csvByBatch(pickEdges(graphs));
      console.log(data.grap);
    }
);
