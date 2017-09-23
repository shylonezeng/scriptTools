/**
 * convert arangodb graph data to csv file,
 * so that can be import self-defined schema data collection.
 * definition of schema colletion: '_key,type,name,description,from,to'
 * created by zengxx
 */
const fs = require('fs');
const path = require('path');

const sourFile = '/Users/zengxx/repo/work/riskbrain-manager-f2e/temp.json';
const outputFile = '/Users/zengxx/data/relations/riskcollections.csv';
const titleLine = '_key,type,name,description,from,to';
const colorOnlyTitleLine = '_key,color';
const colorOnly = true;

// to keep no deperated item
const globalDic = {};
let count = 0;
// const colors = ['Red', 'Cyan', 'Blue', 'DarkBlue', 'LightBlue', 'Purple', 'Yellow', 'Lime', 'Magenta', 'Orange',
// 'Brown', 'Maroon', 'Green', 'Olive', 'Steel Blue', 'Navy Blue', 'Sand', 'Coffee', 'Hot Pink', '',]

const colors = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a', '#c4ccd3', '#00FFFF',
    '#0000FF', '#800080', '#FF00FF', '#00FF00', '#FFA500', '#008000', '#808000', '#FFF380', '#FFFF00'
]

const writeLine2csv = (line) => {
  if (!line) {
    console.warn('null line, igoned');
  }

  fs.appendFileSync(outputFile, line+'\n', {encoding: 'utf8'});
};

const write2csv = (item) => {
    if (!item) {
      return;
    }
    if(globalDic[item._key]) {
      console.warn(`${item._key} existed, ignored`)
      return;
    }

    // mark as existed
    globalDic[item._key] = true;

    // add color from color list
    item['color'] = colors[count];
    count += 1;

    let line = '';
    if (colorOnly) { // append color to vertex
      if (item.type != 2) {
        return ;
      }
      line = `${item._key},${item.color}`
    } else {
      line = `${item._key},${item.type},,,`;
      if (item.from && item.to) {
        line = line + `${item.from},${item.to}`;
      } else {
        line = line + ','
      }
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

fs.readFile(sourFile,  'utf8', (err, data) => {
      if(err) throw err;
      if(data.error) {
        console.error('http request failed');
      }

      const graphs = JSON.parse(data).graphs;
      writeLine2csv( colorOnly ? colorOnlyTitleLine : titleLine);
      append2csvByBatch(pickGraphs(graphs));
      append2csvByBatch(pickVertexes(graphs));
      append2csvByBatch(pickEdges(graphs));
    }
);

console.warn(`finish writing schema data to ${outputFile}`)
