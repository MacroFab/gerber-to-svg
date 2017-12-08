(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.gerberToSvg = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var DEFAULT_OPTS, DrillParser, DrillReader, GerberParser, GerberReader, Plotter, builder, coordFactor;

builder = require('./obj-to-xml');

Plotter = require('./plotter');

DrillReader = require('./drill-reader');

DrillParser = require('./drill-parser');

GerberReader = require('./gerber-reader');

GerberParser = require('./gerber-parser');

coordFactor = require('./svg-coord').factor;

DEFAULT_OPTS = {
  drill: false,
  pretty: false,
  object: false,
  warnArr: null,
  places: null,
  zero: null,
  notation: null,
  units: null
};

module.exports = function(file, options) {
  var a, error, error1, height, key, oldWarn, opts, p, parser, parserOpts, plotterOpts, reader, ref, root, val, width, xml, xmlObject;
  if (options == null) {
    options = {};
  }
  opts = {};
  for (key in DEFAULT_OPTS) {
    val = DEFAULT_OPTS[key];
    opts[key] = val;
  }
  for (key in options) {
    val = options[key];
    opts[key] = val;
  }
  if (typeof file === 'object') {
    if (file.svg != null) {
      return builder(file, {
        pretty: opts.pretty
      });
    } else {
      throw new Error('non SVG object cannot be converted to an SVG string');
    }
  }
  parserOpts = null;
  if ((opts.places != null) || (opts.zero != null)) {
    parserOpts = {
      places: opts.places,
      zero: opts.zero
    };
  }
  if (opts.drill) {
    reader = new DrillReader(file);
    parser = new DrillParser(parserOpts);
  } else {
    reader = new GerberReader(file);
    parser = new GerberParser(parserOpts);
  }
  plotterOpts = null;
  if ((opts.notation != null) || (opts.units != null)) {
    plotterOpts = {
      notation: opts.notation,
      units: opts.units
    };
  }
  p = new Plotter(reader, parser, plotterOpts);
  oldWarn = null;
  root = null;
  if (Array.isArray(opts.warnArr)) {
    root = typeof window !== "undefined" && window !== null ? window : global;
    if (root.console == null) {
      root.console = {};
    }
    oldWarn = root.console.warn;
    root.console.warn = function(chunk) {
      return opts.warnArr.push(chunk.toString());
    };
  }
  try {
    xmlObject = p.plot();
  } catch (error1) {
    error = error1;
    throw new Error("Error at line " + p.reader.line + " - " + error.message);
  } finally {
    if ((oldWarn != null) && (root != null)) {
      root.console.warn = oldWarn;
    }
  }
  if (!(p.bbox.xMin >= p.bbox.xMax)) {
    width = p.bbox.xMax - p.bbox.xMin;
  } else {
    p.bbox.xMin = 0;
    p.bbox.xMax = 0;
    width = 0;
  }
  if (!(p.bbox.yMin >= p.bbox.yMax)) {
    height = p.bbox.yMax - p.bbox.yMin;
  } else {
    p.bbox.yMin = 0;
    p.bbox.yMax = 0;
    height = 0;
  }
  xml = {
    svg: {
      xmlns: 'http://www.w3.org/2000/svg',
      version: '1.1',
      'xmlns:xlink': 'http://www.w3.org/1999/xlink',
      width: "" + (width / coordFactor) + p.units,
      height: "" + (height / coordFactor) + p.units,
      viewBox: [p.bbox.xMin, p.bbox.yMin, width, height],
      _: []
    }
  };
  ref = p.attr;
  for (a in ref) {
    val = ref[a];
    xml.svg[a] = val;
  }
  if (p.defs.length) {
    xml.svg._.push({
      defs: {
        _: p.defs
      }
    });
  }
  if (p.group.g._.length) {
    xml.svg._.push(p.group);
  }
  if (!opts.object) {
    return builder(xml, {
      pretty: opts.pretty
    });
  } else {
    return xml;
  }
};

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvbWlrZS9tZmFiL2dlcmJlci10by1zdmcvc3JjL2dlcmJlci10by1zdmcuY29mZmVlIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbWlrZS9tZmFiL2dlcmJlci10by1zdmcvc3JjL2dlcmJlci10by1zdmcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBLElBQUE7O0FBQUEsT0FBQSxHQUFVLE9BQUEsQ0FBUSxjQUFSOztBQUNWLE9BQUEsR0FBVSxPQUFBLENBQVEsV0FBUjs7QUFHVixXQUFBLEdBQWMsT0FBQSxDQUFRLGdCQUFSOztBQUNkLFdBQUEsR0FBYyxPQUFBLENBQVEsZ0JBQVI7O0FBQ2QsWUFBQSxHQUFlLE9BQUEsQ0FBUSxpQkFBUjs7QUFDZixZQUFBLEdBQWUsT0FBQSxDQUFRLGlCQUFSOztBQUdmLFdBQUEsR0FBYyxPQUFBLENBQVEsYUFBUixDQUFzQixDQUFDOztBQUVyQyxZQUFBLEdBQWU7RUFFYixLQUFBLEVBQU8sS0FGTTtFQUdiLE1BQUEsRUFBUSxLQUhLO0VBSWIsTUFBQSxFQUFRLEtBSks7RUFLYixPQUFBLEVBQVMsSUFMSTtFQU9iLE1BQUEsRUFBUSxJQVBLO0VBUWIsSUFBQSxFQUFNLElBUk87RUFVYixRQUFBLEVBQVUsSUFWRztFQVdiLEtBQUEsRUFBTyxJQVhNOzs7QUFjZixNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLElBQUQsRUFBTyxPQUFQO0FBRWYsTUFBQTs7SUFGc0IsVUFBVTs7RUFFaEMsSUFBQSxHQUFPO0FBQ1AsT0FBQSxtQkFBQTs7SUFBQSxJQUFLLENBQUEsR0FBQSxDQUFMLEdBQVk7QUFBWjtBQUNBLE9BQUEsY0FBQTs7SUFBQSxJQUFLLENBQUEsR0FBQSxDQUFMLEdBQVk7QUFBWjtFQUdBLElBQUcsT0FBTyxJQUFQLEtBQWUsUUFBbEI7SUFDRSxJQUFHLGdCQUFIO0FBQWtCLGFBQU8sT0FBQSxDQUFRLElBQVIsRUFBYztRQUFFLE1BQUEsRUFBUSxJQUFJLENBQUMsTUFB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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./drill-parser":3,"./drill-reader":4,"./gerber-parser":5,"./gerber-reader":6,"./obj-to-xml":9,"./plotter":12,"./svg-coord":14}],2:[function(require,module,exports){
var getSvgCoord;

getSvgCoord = require('./svg-coord').get;

module.exports = function(coord, format) {
  var key, parse, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, result, val;
  if (coord == null) {
    return {};
  }
  if (!((format.zero != null) && (format.places != null))) {
    throw new Error('format undefined');
  }
  parse = {};
  result = {};
  parse.x = (ref = coord.match(/X[+-]?[\d\.]+/)) != null ? (ref1 = ref[0]) != null ? ref1.slice(1) : void 0 : void 0;
  parse.y = (ref2 = coord.match(/Y[+-]?[\d\.]+/)) != null ? (ref3 = ref2[0]) != null ? ref3.slice(1) : void 0 : void 0;
  parse.i = (ref4 = coord.match(/I[+-]?[\d\.]+/)) != null ? (ref5 = ref4[0]) != null ? ref5.slice(1) : void 0 : void 0;
  parse.j = (ref6 = coord.match(/J[+-]?[\d\.]+/)) != null ? (ref7 = ref6[0]) != null ? ref7.slice(1) : void 0 : void 0;
  for (key in parse) {
    val = parse[key];
    if (val != null) {
      result[key] = getSvgCoord(val, format);
    }
  }
  return result;
};

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvbWlrZS9tZmFiL2dlcmJlci10by1zdmcvc3JjL2Nvb3JkLXBhcnNlci5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvaG9tZS9taWtlL21mYWIvZ2VyYmVyLXRvLXN2Zy9zcmMvY29vcmQtcGFyc2VyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFLQSxJQUFBOztBQUFBLFdBQUEsR0FBYyxPQUFBLENBQVEsYUFBUixDQUFzQixDQUFDOztBQUVyQyxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFFLEtBQUYsRUFBUyxNQUFUO0FBQ2YsTUFBQTtFQUFBLElBQU8sYUFBUDtBQUFtQixXQUFPLEdBQTFCOztFQUNBLElBQUEsQ0FBQSxDQUFPLHFCQUFBLElBQWlCLHVCQUF4QixDQUFBO0FBQTRDLFVBQU0sSUFBSSxLQUFKLENBQVUsa0JBQVYsRUFBbEQ7O0VBRUEsS0FBQSxHQUFRO0VBQ1IsTUFBQSxHQUFTO0VBRVQsS0FBSyxDQUFDLENBQU4sZ0ZBQTRDO0VBQzVDLEtBQUssQ0FBQyxDQUFOLGtGQUE0QztFQUM1QyxLQUFLLENBQUMsQ0FBTixrRkFBNEM7RUFDNUMsS0FBSyxDQUFDLENBQU4sa0ZBQTRDO0FBRTVDLE9BQUEsWUFBQTs7SUFDRSxJQUF5QyxXQUF6QztNQUFBLE1BQU8sQ0FBQSxHQUFBLENBQVAsR0FBYyxXQUFBLENBQVksR0FBWixFQUFpQixNQUFqQixFQUFkOztBQURGO1NBR0E7QUFmZSJ9

},{"./svg-coord":14}],3:[function(require,module,exports){
var ABS_COMMAND, DrillParser, INCH_COMMAND, INC_COMMAND, METRIC_COMMAND, PLACES_BACKUP, Parser, ZERO_BACKUP, getSvgCoord, parseCoord, reCOORD,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Parser = require('./parser');

parseCoord = require('./coord-parser');

getSvgCoord = require('./svg-coord').get;

INCH_COMMAND = {
  'FMAT,1': 'M70',
  'FMAT,2': 'M72'
};

METRIC_COMMAND = 'M71';

ABS_COMMAND = 'G90';

INC_COMMAND = 'G91';

reCOORD = /[XY]{1,2}/;

ZERO_BACKUP = 'L';

PLACES_BACKUP = [2, 4];

DrillParser = (function(superClass) {
  extend(DrillParser, superClass);

  function DrillParser() {
    this.fmat = 'FMAT,2';
    DrillParser.__super__.constructor.call(this, arguments[0]);
  }

  DrillParser.prototype.parseCommand = function(block) {
    var base, base1, base2, base3, code, command, dia, k, ref, ref1, ref2, v;
    command = {};
    if (block[0] === ';') {
      return command;
    }
    if (block === 'FMAT,1') {
      this.fmat = block;
    } else if (block === 'M30' || block === 'M00') {
      command.set = {
        done: true
      };
    } else if (block === INCH_COMMAND[this.fmat] || block.match(/INCH/)) {
      if ((base = this.format).places == null) {
        base.places = [2, 4];
      }
      command.set = {
        units: 'in'
      };
    } else if (block === METRIC_COMMAND || block.match(/METRIC/)) {
      if ((base1 = this.format).places == null) {
        base1.places = [3, 3];
      }
      command.set = {
        units: 'mm'
      };
    } else if (block === ABS_COMMAND) {
      command.set = {
        notation: 'A'
      };
    } else if (block === INC_COMMAND) {
      command.set = {
        notation: 'I'
      };
    } else if ((code = (ref = block.match(/T\d+/)) != null ? ref[0] : void 0)) {
      while (code[1] === '0') {
        code = code[0] + code.slice(2);
      }
      if ((dia = (ref1 = block.match(/C[\d\.]+(?=.*$)/)) != null ? ref1[0] : void 0)) {
        dia = dia.slice(1);
        command.tool = {};
        command.tool[code] = {
          dia: getSvgCoord(dia, {
            places: this.format.places
          })
        };
      } else {
        command.set = {
          currentTool: code
        };
      }
    }
    if (block.match(/TZ/)) {
      if ((base2 = this.format).zero == null) {
        base2.zero = 'L';
      }
    } else if (block.match(/LZ/)) {
      if ((base3 = this.format).zero == null) {
        base3.zero = 'T';
      }
    }
    if (block.match(reCOORD)) {
      command.op = {
        "do": 'flash'
      };
      if (this.format.zero == null) {
        console.warn('no drill file zero suppression specified. assuming leading zero suppression (same as no zero suppression)');
        this.format.zero = ZERO_BACKUP;
      }
      if (this.format.places == null) {
        console.warn('no drill file units specified; assuming 2:4 inches format');
        this.format.places = PLACES_BACKUP;
      }
      ref2 = parseCoord(block, this.format);
      for (k in ref2) {
        v = ref2[k];
        command.op[k] = v;
      }
    }
    return command;
  };

  return DrillParser;

})(Parser);

module.exports = DrillParser;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvbWlrZS9tZmFiL2dlcmJlci10by1zdmcvc3JjL2RyaWxsLXBhcnNlci5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvaG9tZS9taWtlL21mYWIvZ2VyYmVyLXRvLXN2Zy9zcmMvZHJpbGwtcGFyc2VyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFLQSxJQUFBLHlJQUFBO0VBQUE7OztBQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjs7QUFFVCxVQUFBLEdBQWEsT0FBQSxDQUFRLGdCQUFSOztBQUViLFdBQUEsR0FBYyxPQUFBLENBQVEsYUFBUixDQUFzQixDQUFDOztBQUdyQyxZQUFBLEdBQWU7RUFBRSxRQUFBLEVBQVUsS0FBWjtFQUFtQixRQUFBLEVBQVUsS0FBN0I7OztBQUNmLGNBQUEsR0FBaUI7O0FBQ2pCLFdBQUEsR0FBYzs7QUFDZCxXQUFBLEdBQWM7O0FBR2QsT0FBQSxHQUFVOztBQUdWLFdBQUEsR0FBYzs7QUFDZCxhQUFBLEdBQWdCLENBQUUsQ0FBRixFQUFLLENBQUw7O0FBRVY7OztFQUNTLHFCQUFBO0lBR1gsSUFBQyxDQUFBLElBQUQsR0FBUTtJQUVSLDZDQUFNLFNBQVUsQ0FBQSxDQUFBLENBQWhCO0VBTFc7O3dCQVFiLFlBQUEsR0FBYyxTQUFDLEtBQUQ7QUFDWixRQUFBO0lBQUEsT0FBQSxHQUFVO0lBRVYsSUFBRyxLQUFNLENBQUEsQ0FBQSxDQUFOLEtBQVksR0FBZjtBQUF3QixhQUFPLFFBQS9COztJQUlBLElBQUcsS0FBQSxLQUFTLFFBQVo7TUFBMEIsSUFBQyxDQUFBLElBQUQsR0FBUSxNQUFsQztLQUFBLE1BRUssSUFBRyxLQUFBLEtBQVMsS0FBVCxJQUFrQixLQUFBLEtBQVMsS0FBOUI7TUFBeUMsT0FBTyxDQUFDLEdBQVIsR0FBYztRQUFDLElBQUEsRUFBTSxJQUFQO1FBQXZEO0tBQUEsTUFFQSxJQUFHLEtBQUEsS0FBUyxZQUFhLENBQUEsSUFBQyxDQUFBLElBQUQsQ0FBdEIsSUFBZ0MsS0FBSyxDQUFDLEtBQU4sQ0FBWSxNQUFaLENBQW5DOztZQUVJLENBQUMsU0FBVSxDQUFDLENBQUQsRUFBSSxDQUFKOztNQUVsQixPQUFPLENBQUMsR0FBUixHQUFjO1FBQUUsS0FBQSxFQUFPLElBQVQ7UUFKWDtLQUFBLE1BTUEsSUFBRyxLQUFBLEtBQVMsY0FBVCxJQUEyQixLQUFLLENBQUMsS0FBTixDQUFZLFFBQVosQ0FBOUI7O2FBRUksQ0FBQyxTQUFVLENBQUMsQ0FBRCxFQUFJLENBQUo7O01BRWxCLE9BQU8sQ0FBQyxHQUFSLEdBQWM7UUFBQyxLQUFBLEVBQU8sSUFBUjtRQUpYO0tBQUEsTUFNQSxJQUFHLEtBQUEsS0FBUyxXQUFaO01BQTZCLE9BQU8sQ0FBQyxHQUFSLEdBQWM7UUFBQyxRQUFBLEVBQVUsR0FBWDtRQUEzQztLQUFBLE1BRUEsSUFBRyxLQUFBLEtBQVMsV0FBWjtNQUE2QixPQUFPLENBQUMsR0FBUixHQUFjO1FBQUMsUUFBQSxFQUFVLEdBQVg7UUFBM0M7S0FBQSxNQUdBLElBQUcsQ0FBRSxJQUFBLDRDQUE0QixDQUFBLENBQUEsVUFBOUIsQ0FBSDtBQUV3QixhQUFNLElBQUssQ0FBQSxDQUFBLENBQUwsS0FBVyxHQUFqQjtRQUEzQixJQUFBLEdBQU8sSUFBSyxDQUFBLENBQUEsQ0FBTCxHQUFVLElBQUs7TUFBSztNQUUzQixJQUFHLENBQUUsR0FBQSx5REFBc0MsQ0FBQSxDQUFBLFVBQXhDLENBQUg7UUFDRSxHQUFBLEdBQU0sR0FBSTtRQUNWLE9BQU8sQ0FBQyxJQUFSLEdBQWU7UUFDZixPQUFPLENBQUMsSUFBSyxDQUFBLElBQUEsQ0FBYixHQUFxQjtVQUFFLEdBQUEsRUFBSyxXQUFBLENBQVksR0FBWixFQUFpQjtZQUFFLE1BQUEsRUFBUSxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQWxCO1dBQWpCLENBQVA7VUFIdkI7T0FBQSxNQUFBO1FBS0UsT0FBTyxDQUFDLEdBQVIsR0FBYztVQUFFLFdBQUEsRUFBYSxJQUFmO1VBTGhCO09BSkc7O0lBY0wsSUFBRyxLQUFLLENBQUMsS0FBTixDQUFZLElBQVosQ0FBSDs7YUFDUyxDQUFDLE9BQVE7T0FEbEI7S0FBQSxNQUVLLElBQUcsS0FBSyxDQUFDLEtBQU4sQ0FBWSxJQUFaLENBQUg7O2FBQ0ksQ0FBQyxPQUFRO09BRGI7O0lBTUwsSUFBRyxLQUFLLENBQUMsS0FBTixDQUFZLE9BQVosQ0FBSDtNQUNFLE9BQU8sQ0FBQyxFQUFSLEdBQWE7UUFBRSxDQUFBLEVBQUEsQ0FBQSxFQUFJLE9BQU47O01BRWIsSUFBTyx3QkFBUDtRQUNFLE9BQU8sQ0FBQyxJQUFSLENBQWEsMkdBQWI7UUFFQSxJQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsR0FBZSxZQUhqQjs7TUFLQSxJQUFPLDBCQUFQO1FBQ0UsT0FBTyxDQUFDLElBQVIsQ0FBYSwyREFBYjtRQUNBLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBUixHQUFpQixjQUZuQjs7QUFHQTtBQUFBLFdBQUEsU0FBQTs7UUFBQSxPQUFPLENBQUMsRUFBRyxDQUFBLENBQUEsQ0FBWCxHQUFnQjtBQUFoQixPQVhGOztXQWNBO0VBaEVZOzs7O0dBVFU7O0FBNEUxQixNQUFNLENBQUMsT0FBUCxHQUFpQiJ9

},{"./coord-parser":2,"./parser":11,"./svg-coord":14}],4:[function(require,module,exports){
var DrillReader;

DrillReader = (function() {
  function DrillReader(drillFile) {
    this.line = 0;
    this.blocks = drillFile.split(/\r?\n/);
  }

  DrillReader.prototype.nextBlock = function() {
    if (this.line < this.blocks.length) {
      return this.blocks[++this.line - 1];
    } else {
      return false;
    }
  };

  return DrillReader;

})();

module.exports = DrillReader;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvbWlrZS9tZmFiL2dlcmJlci10by1zdmcvc3JjL2RyaWxsLXJlYWRlci5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvaG9tZS9taWtlL21mYWIvZ2VyYmVyLXRvLXN2Zy9zcmMvZHJpbGwtcmVhZGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSxJQUFBOztBQUFNO0VBQ1MscUJBQUMsU0FBRDtJQUNYLElBQUMsQ0FBQSxJQUFELEdBQVE7SUFDUixJQUFDLENBQUEsTUFBRCxHQUFVLFNBQVMsQ0FBQyxLQUFWLENBQWdCLE9BQWhCO0VBRkM7O3dCQUliLFNBQUEsR0FBVyxTQUFBO0lBQ1QsSUFBRyxJQUFDLENBQUEsSUFBRCxHQUFRLElBQUMsQ0FBQSxNQUFNLENBQUMsTUFBbkI7YUFBK0IsSUFBQyxDQUFBLE1BQU8sQ0FBQSxFQUFFLElBQUMsQ0FBQSxJQUFILEdBQVUsQ0FBVixFQUF2QztLQUFBLE1BQUE7YUFBeUQsTUFBekQ7O0VBRFM7Ozs7OztBQUliLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIn0=

},{}],5:[function(require,module,exports){
var GerberParser, Parser, getSvgCoord, parseCoord, reCOORD, reFS,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Parser = require('./parser');

parseCoord = require('./coord-parser');

getSvgCoord = require('./svg-coord').get;

reCOORD = /([XYIJ][+-]?\d+){1,4}/g;

reFS = /^FS([A-Z]?)([A-Z]?)X([0-7])([0-7])Y\3\4/;

GerberParser = (function(superClass) {
  extend(GerberParser, superClass);

  function GerberParser() {
    return GerberParser.__super__.constructor.apply(this, arguments);
  }

  GerberParser.prototype.parseFormat = function(p, c) {
    var _, base, base1, m, nota, pM, pN, zero;
    if (!(m = p.match(reFS))) {
      throw new Error('invalid format specification');
    }
    _ = m[0], zero = m[1], nota = m[2], pN = m[3], pM = m[4];
    if (zero !== 'L' && zero !== 'T') {
      console.warn('gerber zero suppression is not specified. assuming leading zero suppression (same as no zero suppression)');
      zero = 'L';
    }
    if (nota !== 'A' && nota !== 'I') {
      console.warn('gerber coordinate notation is not specified. assuming absolute notation');
      nota = 'A';
    }
    if ((base = this.format).zero == null) {
      base.zero = zero;
    }
    if ((base1 = this.format).places == null) {
      base1.places = [Number(pN), Number(pM)];
    }
    if (c.set == null) {
      c.set = {};
    }
    return c.set.notation = nota;
  };

  GerberParser.prototype.parseToolDef = function(p, c) {
    var code, hole, m, mods, ref, ref1, shape;
    if (c.tool == null) {
      c.tool = {};
    }
    code = (ref = p.match(/^ADD\d{2,}/)) != null ? ref[0].slice(2) : void 0;
    ref1 = p.slice(2 + code.length).split(','), shape = ref1[0], mods = ref1[1];
    mods = mods != null ? mods.split('X') : void 0;
    while (code[1] === '0') {
      code = code[0] + code.slice(2);
    }
    switch (shape) {
      case 'C':
        if (mods.length > 2) {
          hole = {
            width: getSvgCoord(mods[1], {
              places: this.format.places
            }),
            height: getSvgCoord(mods[2], {
              places: this.format.places
            })
          };
        } else if (mods.length > 1) {
          hole = {
            dia: getSvgCoord(mods[1], {
              places: this.format.places
            })
          };
        }
        c.tool[code] = {
          dia: getSvgCoord(mods[0], {
            places: this.format.places
          })
        };
        if (hole != null) {
          return c.tool[code].hole = hole;
        }
        break;
      case 'R':
      case 'O':
        if (mods.length > 3) {
          hole = {
            width: getSvgCoord(mods[2], {
              places: this.format.places
            }),
            height: getSvgCoord(mods[3], {
              places: this.format.places
            })
          };
        } else if (mods.length > 2) {
          hole = {
            dia: getSvgCoord(mods[2], {
              places: this.format.places
            })
          };
        }
        c.tool[code] = {
          width: getSvgCoord(mods[0], {
            places: this.format.places
          }),
          height: getSvgCoord(mods[1], {
            places: this.format.places
          })
        };
        if (shape === 'O') {
          c.tool[code].obround = true;
        }
        if (hole != null) {
          return c.tool[code].hole = hole;
        }
        break;
      case 'P':
        if (mods.length > 4) {
          hole = {
            width: getSvgCoord(mods[3], {
              places: this.format.places
            }),
            height: getSvgCoord(mods[4], {
              places: this.format.places
            })
          };
        } else if (mods.length > 3) {
          hole = {
            dia: getSvgCoord(mods[3], {
              places: this.format.places
            })
          };
        }
        c.tool[code] = {
          dia: getSvgCoord(mods[0], {
            places: this.format.places
          }),
          verticies: +mods[1]
        };
        if (mods.length > 2) {
          c.tool[code].degrees = +mods[2];
        }
        if (hole != null) {
          return c.tool[code].hole = hole;
        }
        break;
      default:
        mods = (function() {
          var k, len, ref2, results;
          ref2 = mods != null ? mods : [];
          results = [];
          for (k = 0, len = ref2.length; k < len; k++) {
            m = ref2[k];
            results.push(+m);
          }
          return results;
        })();
        return c.tool[code] = {
          macro: shape,
          mods: mods
        };
    }
  };

  GerberParser.prototype.parseCommand = function(block) {
    var axis, c, code, coord, i, j, k, len, m, op, p, param, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, ref9, tool, u, val, x, y;
    if (block == null) {
      block = {};
    }
    c = {};
    if (param = block.param) {
      for (k = 0, len = param.length; k < len; k++) {
        p = param[k];
        switch (code = p.slice(0, 2)) {
          case 'FS':
            this.parseFormat(p, c);
            break;
          case 'MO':
            u = p.slice(2, 4);
            if (c.set == null) {
              c.set = {};
            }
            if (u === 'IN') {
              c.set.units = 'in';
            } else if (u === 'MM') {
              c.set.units = 'mm';
            } else {
              throw new Error(p + " is an invalid units setting");
            }
            break;
          case 'AD':
            this.parseToolDef(p, c);
            break;
          case 'AM':
            return {
              macro: param
            };
          case 'LP':
            if (c["new"] == null) {
              c["new"] = {};
            }
            if (p[2] === 'D' || p[2] === 'C') {
              c["new"].layer = p[2];
            }
            if (c["new"].layer == null) {
              throw new Error('invalid level polarity');
            }
            break;
          case 'SR':
            if (c["new"] == null) {
              c["new"] = {};
            }
            x = (ref = (ref1 = p.match(/X[+-]?[\d\.]+/)) != null ? ref1[0].slice(1) : void 0) != null ? ref : 1;
            y = (ref2 = (ref3 = p.match(/Y[+-]?[\d\.]+/)) != null ? ref3[0].slice(1) : void 0) != null ? ref2 : 1;
            i = (ref4 = p.match(/I[+-]?[\d\.]+/)) != null ? ref4[0].slice(1) : void 0;
            j = (ref5 = p.match(/J[+-]?[\d\.]+/)) != null ? ref5[0].slice(1) : void 0;
            if ((x < 1 || y < 1) || (x > 1 && ((i == null) || i < 0)) || (y > 1 && ((j == null) || j < 0))) {
              throw new Error('invalid step repeat');
            }
            c["new"].sr = {
              x: +x,
              y: +y
            };
            if (i != null) {
              c["new"].sr.i = getSvgCoord(i, {
                places: this.format.places
              });
            }
            if (j != null) {
              c["new"].sr.j = getSvgCoord(j, {
                places: this.format.places
              });
            }
        }
      }
    } else if (block = block.block) {
      if (block === 'M02') {
        return {
          set: {
            done: true
          }
        };
      } else if (block[0] === 'G') {
        switch (code = (ref6 = block.slice(1).match(/^\d{1,2}/)) != null ? ref6[0] : void 0) {
          case '4':
          case '04':
            return {};
          case '1':
          case '01':
          case '2':
          case '02':
          case '3':
          case '03':
            code = code[code.length - 1];
            m = code === '1' ? 'i' : code === '2' ? 'cw' : 'ccw';
            c.set = {
              mode: m
            };
            break;
          case '36':
          case '37':
            c.set = {
              region: code === '36'
            };
            break;
          case '70':
          case '71':
            c.set = {
              backupUnits: code === '70' ? 'in' : 'mm'
            };
            break;
          case '74':
          case '75':
            c.set = {
              quad: code === '74' ? 's' : 'm'
            };
        }
      }
      coord = parseCoord((ref7 = block.match(reCOORD)) != null ? ref7[0] : void 0, this.format);
      if (op = ((ref8 = block.match(/D0?[123]$/)) != null ? ref8[0] : void 0) || Object.keys(coord).length) {
        if (op != null) {
          op = op[op.length - 1];
        }
        op = (function() {
          switch (op) {
            case '1':
              return 'int';
            case '2':
              return 'move';
            case '3':
              return 'flash';
            default:
              return 'last';
          }
        })();
        c.op = {
          "do": op
        };
        for (axis in coord) {
          val = coord[axis];
          c.op[axis] = val;
        }
      } else if (tool = (ref9 = block.match(/D\d+$/)) != null ? ref9[0] : void 0) {
        c.set = {
          currentTool: tool
        };
      }
    }
    return c;
  };

  return GerberParser;

})(Parser);

module.exports = GerberParser;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvbWlrZS9tZmFiL2dlcmJlci10by1zdmcvc3JjL2dlcmJlci1wYXJzZXIuY29mZmVlIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbWlrZS9tZmFiL2dlcmJlci10by1zdmcvc3JjL2dlcmJlci1wYXJzZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUtBLElBQUEsNERBQUE7RUFBQTs7O0FBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSOztBQUVULFVBQUEsR0FBYSxPQUFBLENBQVEsZ0JBQVI7O0FBRWIsV0FBQSxHQUFjLE9BQUEsQ0FBUSxhQUFSLENBQXNCLENBQUM7O0FBSXJDLE9BQUEsR0FBVTs7QUFHVixJQUFBLEdBQU87O0FBU0Q7Ozs7Ozs7eUJBR0osV0FBQSxHQUFhLFNBQUMsQ0FBRCxFQUFJLENBQUo7QUFDWCxRQUFBO0lBQUEsSUFBRyxDQUFJLENBQUMsQ0FBQSxHQUFJLENBQUMsQ0FBQyxLQUFGLENBQVEsSUFBUixDQUFMLENBQVA7QUFDRSxZQUFNLElBQUksS0FBSixDQUFVLDhCQUFWLEVBRFI7O0lBRUMsUUFBRCxFQUFJLFdBQUosRUFBVSxXQUFWLEVBQWdCLFNBQWhCLEVBQW9CO0lBQ3BCLElBQUcsSUFBQSxLQUFVLEdBQVYsSUFBa0IsSUFBQSxLQUFVLEdBQS9CO01BQ0UsT0FBTyxDQUFDLElBQVIsQ0FBYSwyR0FBYjtNQUVBLElBQUEsR0FBTyxJQUhUOztJQUlBLElBQUcsSUFBQSxLQUFVLEdBQVYsSUFBa0IsSUFBQSxLQUFVLEdBQS9CO01BQ0UsT0FBTyxDQUFDLElBQVIsQ0FBYSx5RUFBYjtNQUVBLElBQUEsR0FBTyxJQUhUOzs7VUFJTyxDQUFDLE9BQVE7OztXQUNULENBQUMsU0FBVSxDQUFDLE1BQUEsQ0FBTyxFQUFQLENBQUQsRUFBYSxNQUFBLENBQU8sRUFBUCxDQUFiOzs7TUFDbEIsQ0FBQyxDQUFDLE1BQU87O1dBQ1QsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFOLEdBQWlCO0VBZk47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

},{"./coord-parser":2,"./parser":11,"./svg-coord":14}],6:[function(require,module,exports){
var GerberReader;

GerberReader = (function() {
  function GerberReader(gerberFile) {
    this.gerberFile = gerberFile != null ? gerberFile : '';
    this.line = 0;
    this.charIndex = 0;
    this.end = this.gerberFile.length;
  }

  GerberReader.prototype.nextBlock = function() {
    var char, current, parameter;
    if (this.index >= this.end) {
      return false;
    }
    current = '';
    parameter = false;
    if (this.line === 0) {
      this.line++;
    }
    while (!(this.charIndex >= this.end)) {
      char = this.gerberFile[this.charIndex++];
      if (char === '%') {
        if (!parameter) {
          parameter = [];
        } else {
          return {
            param: parameter
          };
        }
      } else if (char === '*') {
        if (parameter) {
          parameter.push(current);
          current = '';
        } else {
          return {
            block: current
          };
        }
      } else if (char === '\n') {
        this.line++;
      } else if ((' ' <= char && char <= '~')) {
        current += char;
      }
    }
    return false;
  };

  GerberReader.prototype.getLine = function() {
    return this.line;
  };

  return GerberReader;

})();

module.exports = GerberReader;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvbWlrZS9tZmFiL2dlcmJlci10by1zdmcvc3JjL2dlcmJlci1yZWFkZXIuY29mZmVlIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbWlrZS9tZmFiL2dlcmJlci10by1zdmcvc3JjL2dlcmJlci1yZWFkZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUlBLElBQUE7O0FBQU07RUFDUyxzQkFBQyxVQUFEO0lBQUMsSUFBQyxDQUFBLGtDQUFELGFBQWM7SUFDMUIsSUFBQyxDQUFBLElBQUQsR0FBUTtJQUVSLElBQUMsQ0FBQSxTQUFELEdBQWE7SUFDYixJQUFDLENBQUEsR0FBRCxHQUFPLElBQUMsQ0FBQSxVQUFVLENBQUM7RUFKUjs7eUJBU2IsU0FBQSxHQUFXLFNBQUE7QUFFVCxRQUFBO0lBQUEsSUFBZ0IsSUFBQyxDQUFBLEtBQUQsSUFBVSxJQUFDLENBQUEsR0FBM0I7QUFBQSxhQUFPLE1BQVA7O0lBRUEsT0FBQSxHQUFVO0lBRVYsU0FBQSxHQUFZO0lBRVosSUFBRyxJQUFDLENBQUEsSUFBRCxLQUFTLENBQVo7TUFBbUIsSUFBQyxDQUFBLElBQUQsR0FBbkI7O0FBRUEsV0FBQSxDQUFBLENBQU0sSUFBQyxDQUFBLFNBQUQsSUFBYyxJQUFDLENBQUEsR0FBckIsQ0FBQTtNQUNFLElBQUEsR0FBTyxJQUFDLENBQUEsVUFBVyxDQUFBLElBQUMsQ0FBQSxTQUFELEVBQUE7TUFFbkIsSUFBRyxJQUFBLEtBQVEsR0FBWDtRQUNFLElBQUcsQ0FBSSxTQUFQO1VBQXNCLFNBQUEsR0FBWSxHQUFsQztTQUFBLE1BQUE7QUFBMEMsaUJBQU87WUFBRSxLQUFBLEVBQU8sU0FBVDtZQUFqRDtTQURGO09BQUEsTUFHSyxJQUFHLElBQUEsS0FBUSxHQUFYO1FBQ0gsSUFBRyxTQUFIO1VBQWtCLFNBQVMsQ0FBQyxJQUFWLENBQWUsT0FBZjtVQUF3QixPQUFBLEdBQVUsR0FBcEQ7U0FBQSxNQUFBO0FBQ0ssaUJBQU87WUFBRSxLQUFBLEVBQU8sT0FBVDtZQURaO1NBREc7T0FBQSxNQUlBLElBQUcsSUFBQSxLQUFRLElBQVg7UUFBcUIsSUFBQyxDQUFBLElBQUQsR0FBckI7T0FBQSxNQUVBLElBQUcsQ0FBQSxHQUFBLElBQU8sSUFBUCxJQUFPLElBQVAsSUFBZSxHQUFmLENBQUg7UUFBMkIsT0FBQSxJQUFXLEtBQXRDOztJQVpQO0FBY0EsV0FBTztFQXhCRTs7eUJBMEJYLE9BQUEsR0FBUyxTQUFBO1dBQ1AsSUFBQyxDQUFBO0VBRE07Ozs7OztBQUdYLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIn0=

},{}],7:[function(require,module,exports){
var NUMBER, OPERATOR, TOKEN, isNumber, parse, tokenize;

OPERATOR = /[\+\-\/xX\(\)]/;

NUMBER = /[\$\d\.]+/;

TOKEN = new RegExp("(" + OPERATOR.source + ")|(" + NUMBER.source + ")", 'g');

tokenize = function(arith) {
  var results;
  return results = arith.match(TOKEN);
};

isNumber = function(token) {
  return NUMBER.test(token);
};

parse = function(arith) {
  var consume, index, parseExpression, parseMultiplication, parsePrimary, peek, tokens;
  tokens = tokenize(arith);
  index = 0;
  peek = function() {
    return tokens[index];
  };
  consume = function(t) {
    if (t === peek()) {
      return index++;
    }
  };
  parsePrimary = function() {
    var exp, t;
    t = peek();
    consume(t);
    if (isNumber(t)) {
      exp = {
        type: 'n',
        val: t
      };
    } else if (t === '(') {
      exp = parseExpression();
      if (peek() !== ')') {
        throw new Error("expected ')'");
      } else {
        consume(')');
      }
    } else {
      throw new Error(t + " is unexpected in an arithmetic string");
    }
    return exp;
  };
  parseMultiplication = function() {
    var exp, rhs, t;
    exp = parsePrimary();
    t = peek();
    while (t === 'x' || t === '/' || t === 'X') {
      consume(t);
      if (t === 'X') {
        console.warn("Warning: uppercase 'X' as multiplication symbol is incorrect; macros should use lowercase 'x' to multiply");
        t = 'x';
      }
      rhs = parsePrimary();
      exp = {
        type: t,
        left: exp,
        right: rhs
      };
      t = peek();
    }
    return exp;
  };
  parseExpression = function() {
    var exp, rhs, t;
    exp = parseMultiplication();
    t = peek();
    while (t === '+' || t === '-') {
      consume(t);
      rhs = parseMultiplication();
      exp = {
        type: t,
        left: exp,
        right: rhs
      };
      t = peek();
    }
    return exp;
  };
  return parseExpression();
};

module.exports = {
  tokenize: tokenize,
  isNumber: isNumber,
  parse: parse
};

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvbWlrZS9tZmFiL2dlcmJlci10by1zdmcvc3JjL21hY3JvLWNhbGMuY29mZmVlIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbWlrZS9tZmFiL2dlcmJlci10by1zdmcvc3JjL21hY3JvLWNhbGMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBLElBQUE7O0FBQUEsUUFBQSxHQUFXOztBQUNYLE1BQUEsR0FBUzs7QUFDVCxLQUFBLEdBQVEsSUFBSSxNQUFKLENBQVcsR0FBQSxHQUFJLFFBQVEsQ0FBQyxNQUFiLEdBQW9CLEtBQXBCLEdBQXlCLE1BQU0sQ0FBQyxNQUFoQyxHQUF1QyxHQUFsRCxFQUFzRCxHQUF0RDs7QUFHUixRQUFBLEdBQVcsU0FBQyxLQUFEO0FBQ1QsTUFBQTtTQUFBLE9BQUEsR0FBVSxLQUFLLENBQUMsS0FBTixDQUFZLEtBQVo7QUFERDs7QUFJWCxRQUFBLEdBQVcsU0FBQyxLQUFEO1NBQ1QsTUFBTSxDQUFDLElBQVAsQ0FBWSxLQUFaO0FBRFM7O0FBSVgsS0FBQSxHQUFRLFNBQUMsS0FBRDtBQUNOLE1BQUE7RUFBQSxNQUFBLEdBQVMsUUFBQSxDQUFTLEtBQVQ7RUFDVCxLQUFBLEdBQVE7RUFHUixJQUFBLEdBQU8sU0FBQTtXQUFHLE1BQU8sQ0FBQSxLQUFBO0VBQVY7RUFDUCxPQUFBLEdBQVUsU0FBQyxDQUFEO0lBQU8sSUFBRyxDQUFBLEtBQUssSUFBQSxDQUFBLENBQVI7YUFBb0IsS0FBQSxHQUFwQjs7RUFBUDtFQUdWLFlBQUEsR0FBZSxTQUFBO0FBQ2IsUUFBQTtJQUFBLENBQUEsR0FBSSxJQUFBLENBQUE7SUFDSixPQUFBLENBQVEsQ0FBUjtJQUNBLElBQUcsUUFBQSxDQUFTLENBQVQsQ0FBSDtNQUFtQixHQUFBLEdBQU07UUFBRSxJQUFBLEVBQU0sR0FBUjtRQUFhLEdBQUEsRUFBSyxDQUFsQjtRQUF6QjtLQUFBLE1BQ0ssSUFBRyxDQUFBLEtBQUssR0FBUjtNQUNILEdBQUEsR0FBTSxlQUFBLENBQUE7TUFDTixJQUFHLElBQUEsQ0FBQSxDQUFBLEtBQVksR0FBZjtBQUF3QixjQUFNLElBQUksS0FBSixDQUFVLGNBQVYsRUFBOUI7T0FBQSxNQUFBO1FBQTRELE9BQUEsQ0FBUSxHQUFSLEVBQTVEO09BRkc7S0FBQSxNQUFBO0FBSUgsWUFBTSxJQUFJLEtBQUosQ0FBYSxDQUFELEdBQUcsd0NBQWYsRUFKSDs7V0FLTDtFQVRhO0VBWWYsbUJBQUEsR0FBc0IsU0FBQTtBQUNwQixRQUFBO0lBQUEsR0FBQSxHQUFNLFlBQUEsQ0FBQTtJQUNOLENBQUEsR0FBSSxJQUFBLENBQUE7QUFDSixXQUFNLENBQUEsS0FBSyxHQUFMLElBQVksQ0FBQSxLQUFLLEdBQWpCLElBQXdCLENBQUEsS0FBSyxHQUFuQztNQUNFLE9BQUEsQ0FBUSxDQUFSO01BRUEsSUFBRyxDQUFBLEtBQUssR0FBUjtRQUNFLE9BQU8sQ0FBQyxJQUFSLENBQWEsMkdBQWI7UUFFQSxDQUFBLEdBQUksSUFITjs7TUFJQSxHQUFBLEdBQU0sWUFBQSxDQUFBO01BQ04sR0FBQSxHQUFNO1FBQUUsSUFBQSxFQUFNLENBQVI7UUFBVyxJQUFBLEVBQU0sR0FBakI7UUFBc0IsS0FBQSxFQUFPLEdBQTdCOztNQUNOLENBQUEsR0FBSSxJQUFBLENBQUE7SUFUTjtXQVVBO0VBYm9CO0VBZ0J0QixlQUFBLEdBQWtCLFNBQUE7QUFDaEIsUUFBQTtJQUFBLEdBQUEsR0FBTSxtQkFBQSxDQUFBO0lBQ04sQ0FBQSxHQUFJLElBQUEsQ0FBQTtBQUNKLFdBQU0sQ0FBQSxLQUFLLEdBQUwsSUFBWSxDQUFBLEtBQUssR0FBdkI7TUFDRSxPQUFBLENBQVEsQ0FBUjtNQUNBLEdBQUEsR0FBTSxtQkFBQSxDQUFBO01BQ04sR0FBQSxHQUFNO1FBQUUsSUFBQSxFQUFNLENBQVI7UUFBVyxJQUFBLEVBQU0sR0FBakI7UUFBc0IsS0FBQSxFQUFPLEdBQTdCOztNQUNOLENBQUEsR0FBSSxJQUFBLENBQUE7SUFKTjtXQUtBO0VBUmdCO1NBVWxCLGVBQUEsQ0FBQTtBQS9DTTs7QUFpRFIsTUFBTSxDQUFDLE9BQVAsR0FBaUI7RUFDZixRQUFBLEVBQVUsUUFESztFQUVmLFFBQUEsRUFBVSxRQUZLO0VBR2YsS0FBQSxFQUFPLEtBSFEifQ==

},{}],8:[function(require,module,exports){
var MacroTool, calc, getSvgCoord, shapes, unique;

shapes = require('./pad-shapes');

calc = require('./macro-calc');

unique = require('./unique-id');

getSvgCoord = require('./svg-coord').get;

MacroTool = (function() {
  function MacroTool(blocks, numberFormat) {
    this.modifiers = {};
    this.name = blocks[0].slice(2);
    this.blocks = blocks.slice(1);
    this.shapes = [];
    this.masks = [];
    this.lastExposure = null;
    this.bbox = [null, null, null, null];
    this.format = {
      places: numberFormat
    };
  }

  MacroTool.prototype.run = function(tool, modifiers) {
    var b, group, i, j, k, l, len, len1, len2, len3, m, n, pad, padId, ref, ref1, ref2, s, shape;
    if (modifiers == null) {
      modifiers = [];
    }
    this.lastExposure = null;
    this.shapes = [];
    this.masks = [];
    this.bbox = [null, null, null, null];
    this.modifiers = {};
    for (i = j = 0, len = modifiers.length; j < len; i = ++j) {
      m = modifiers[i];
      this.modifiers["$" + (i + 1)] = m;
    }
    ref = this.blocks;
    for (k = 0, len1 = ref.length; k < len1; k++) {
      b = ref[k];
      this.runBlock(b);
    }
    padId = "tool-" + tool + "-pad-" + (unique());
    pad = [];
    ref1 = this.masks;
    for (l = 0, len2 = ref1.length; l < len2; l++) {
      m = ref1[l];
      pad.push(m);
    }
    if (this.shapes.length > 1) {
      group = {
        id: padId,
        _: []
      };
      ref2 = this.shapes;
      for (n = 0, len3 = ref2.length; n < len3; n++) {
        s = ref2[n];
        group._.push(s);
      }
      pad = [
        {
          g: group
        }
      ];
    } else if (this.shapes.length === 1) {
      shape = Object.keys(this.shapes[0])[0];
      this.shapes[0][shape].id = padId;
      pad.push(this.shapes[0]);
    }
    return {
      pad: pad,
      padId: padId,
      bbox: this.bbox,
      trace: false
    };
  };

  MacroTool.prototype.runBlock = function(block) {
    var a, args, i, j, len, mod, ref, val;
    switch (block[0]) {
      case '$':
        mod = (ref = block.match(/^\$\d+(?=\=)/)) != null ? ref[0] : void 0;
        val = block.slice(1 + mod.length);
        return this.modifiers[mod] = this.getNumber(val);
      case '1':
      case '2':
      case '20':
      case '21':
      case '22':
      case '4':
      case '5':
      case '6':
      case '7':
        args = block.split(',');
        for (i = j = 0, len = args.length; j < len; i = ++j) {
          a = args[i];
          args[i] = this.getNumber(a);
        }
        return this.primitive(args);
      default:
        if (block[0] !== '0') {
          throw new Error("'" + block + "' unrecognized tool macro block");
        }
    }
  };

  MacroTool.prototype.primitive = function(args) {
    var group, i, j, k, key, l, len, len1, len2, len3, len4, m, mask, maskId, n, o, points, q, ref, ref1, ref2, ref3, ref4, ref5, results, rot, rotation, s, shape;
    mask = false;
    rotation = false;
    shape = null;
    switch (args[0]) {
      case 1:
        shape = shapes.circle({
          dia: getSvgCoord(args[2], this.format),
          cx: getSvgCoord(args[3], this.format),
          cy: getSvgCoord(args[4], this.format)
        });
        if (args[1] === 0) {
          mask = true;
        } else {
          this.addBbox(shape.bbox);
        }
        break;
      case 2:
      case 20:
        shape = shapes.vector({
          width: getSvgCoord(args[2], this.format),
          x1: getSvgCoord(args[3], this.format),
          y1: getSvgCoord(args[4], this.format),
          x2: getSvgCoord(args[5], this.format),
          y2: getSvgCoord(args[6], this.format)
        });
        if (args[7]) {
          shape.shape.line.transform = "rotate(" + args[7] + ")";
        }
        if (args[1] === 0) {
          mask = true;
        } else {
          this.addBbox(shape.bbox, args[7]);
        }
        break;
      case 21:
        shape = shapes.rect({
          cx: getSvgCoord(args[4], this.format),
          cy: getSvgCoord(args[5], this.format),
          width: getSvgCoord(args[2], this.format),
          height: getSvgCoord(args[3], this.format)
        });
        if (args[6]) {
          shape.shape.rect.transform = "rotate(" + args[6] + ")";
        }
        if (args[1] === 0) {
          mask = true;
        } else {
          this.addBbox(shape.bbox, args[6]);
        }
        break;
      case 22:
        shape = shapes.lowerLeftRect({
          x: getSvgCoord(args[4], this.format),
          y: getSvgCoord(args[5], this.format),
          width: getSvgCoord(args[2], this.format),
          height: getSvgCoord(args[3], this.format)
        });
        if (args[6]) {
          shape.shape.rect.transform = "rotate(" + args[6] + ")";
        }
        if (args[1] === 0) {
          mask = true;
        } else {
          this.addBbox(shape.bbox, args[6]);
        }
        break;
      case 4:
        points = [];
        for (i = j = 3, ref = 3 + 2 * args[2]; j <= ref; i = j += 2) {
          points.push([getSvgCoord(args[i], this.format), getSvgCoord(args[i + 1], this.format)]);
        }
        shape = shapes.outline({
          points: points
        });
        if (rot = args[args.length - 1]) {
          shape.shape.polygon.transform = "rotate(" + rot + ")";
        }
        if (args[1] === 0) {
          mask = true;
        } else {
          this.addBbox(shape.bbox, args[args.length - 1]);
        }
        break;
      case 5:
        if (args[6] !== 0 && (args[3] !== 0 || args[4] !== 0)) {
          throw new RangeError('polygon center must be 0,0 if rotated in macro');
        }
        shape = shapes.polygon({
          cx: getSvgCoord(args[3], this.format),
          cy: getSvgCoord(args[4], this.format),
          dia: getSvgCoord(args[5], this.format),
          verticies: args[2],
          degrees: args[6]
        });
        if (args[1] === 0) {
          mask = true;
        } else {
          this.addBbox(shape.bbox);
        }
        break;
      case 6:
        if (args[9] !== 0 && (args[1] !== 0 || args[2] !== 0)) {
          throw new RangeError('moiré center must be 0,0 if rotated in macro');
        }
        shape = shapes.moire({
          cx: getSvgCoord(args[1], this.format),
          cy: getSvgCoord(args[2], this.format),
          outerDia: getSvgCoord(args[3], this.format),
          ringThx: getSvgCoord(args[4], this.format),
          ringGap: getSvgCoord(args[5], this.format),
          maxRings: args[6],
          crossThx: getSvgCoord(args[7], this.format),
          crossLength: getSvgCoord(args[8], this.format)
        });
        if (args[9]) {
          ref1 = shape.shape;
          for (k = 0, len = ref1.length; k < len; k++) {
            s = ref1[k];
            if (s.line != null) {
              s.line.transform = "rotate(" + args[9] + ")";
            }
          }
        }
        this.addBbox(shape.bbox, args[9]);
        break;
      case 7:
        if (args[9] !== 0 && (args[1] !== 0 || args[2] !== 0)) {
          throw new RangeError('thermal center must be 0,0 if rotated in macro');
        }
        shape = shapes.thermal({
          cx: getSvgCoord(args[1], this.format),
          cy: getSvgCoord(args[2], this.format),
          outerDia: getSvgCoord(args[3], this.format),
          innerDia: getSvgCoord(args[4], this.format),
          gap: getSvgCoord(args[5], this.format)
        });
        if (args[6]) {
          ref2 = shape.shape;
          for (l = 0, len1 = ref2.length; l < len1; l++) {
            s = ref2[l];
            if (s.mask != null) {
              ref3 = s.mask._;
              for (n = 0, len2 = ref3.length; n < len2; n++) {
                m = ref3[n];
                if (m.rect != null) {
                  m.rect.transform = "rotate(" + args[6] + ")";
                }
              }
            }
          }
        }
        this.addBbox(shape.bbox, args[6]);
        break;
      default:
        throw new Error(args[0] + " is not a valid primitive code");
    }
    if (mask) {
      for (key in shape.shape) {
        shape.shape[key].fill = '#000';
      }
      if (this.lastExposure !== 0) {
        this.lastExposure = 0;
        maskId = "macro-" + this.name + "-mask-" + (unique());
        m = {
          mask: {
            id: maskId
          }
        };
        m.mask._ = [
          {
            rect: {
              x: this.bbox[0],
              y: this.bbox[1],
              width: this.bbox[2] - this.bbox[0],
              height: this.bbox[3] - this.bbox[1],
              fill: '#fff'
            }
          }
        ];
        if (this.shapes.length === 1) {
          for (key in this.shapes[0]) {
            this.shapes[0][key].mask = "url(#" + maskId + ")";
          }
        } else if (this.shapes.length > 1) {
          group = {
            mask: "url(#" + maskId + ")",
            _: []
          };
          ref4 = this.shapes;
          for (o = 0, len3 = ref4.length; o < len3; o++) {
            s = ref4[o];
            group._.push(s);
          }
          this.shapes = [
            {
              g: group
            }
          ];
        }
        this.masks.push(m);
      }
      return this.masks[this.masks.length - 1].mask._.push(shape.shape);
    } else {
      this.lastExposure = 1;
      if (!Array.isArray(shape.shape)) {
        return this.shapes.push(shape.shape);
      } else {
        ref5 = shape.shape;
        results = [];
        for (q = 0, len4 = ref5.length; q < len4; q++) {
          s = ref5[q];
          if (s.mask != null) {
            results.push(this.masks.push(s));
          } else {
            results.push(this.shapes.push(s));
          }
        }
        return results;
      }
    }
  };

  MacroTool.prototype.addBbox = function(bbox, rotation) {
    var b, c, j, len, p, points, s, x, y;
    if (rotation == null) {
      rotation = 0;
    }
    if (!rotation) {
      if (this.bbox[0] === null || bbox[0] < this.bbox[0]) {
        this.bbox[0] = bbox[0];
      }
      if (this.bbox[1] === null || bbox[1] < this.bbox[1]) {
        this.bbox[1] = bbox[1];
      }
      if (this.bbox[2] === null || bbox[2] > this.bbox[2]) {
        this.bbox[2] = bbox[2];
      }
      if (this.bbox[3] === null || bbox[3] > this.bbox[3]) {
        return this.bbox[3] = bbox[3];
      }
    } else {
      s = Math.sin(rotation * Math.PI / 180);
      c = Math.cos(rotation * Math.PI / 180);
      if (Math.abs(s) < 0.000000001) {
        s = 0;
      }
      if (Math.abs(c) < 0.000000001) {
        c = 0;
      }
      points = [[bbox[0], bbox[1]], [bbox[2], bbox[1]], [bbox[2], bbox[3]], [bbox[0], bbox[3]]];
      for (j = 0, len = points.length; j < len; j++) {
        p = points[j];
        x = (p[0] * c) - (p[1] * s);
        y = (p[0] * s) + (p[1] * c);
        if (this.bbox[0] === null || x < this.bbox[0]) {
          this.bbox[0] = x;
        }
        if (this.bbox[1] === null || y < this.bbox[1]) {
          this.bbox[1] = y;
        }
        if (this.bbox[2] === null || x > this.bbox[2]) {
          this.bbox[2] = x;
        }
        if (this.bbox[3] === null || y > this.bbox[3]) {
          this.bbox[3] = y;
        }
      }
      return this.bbox = (function() {
        var k, len1, ref, results;
        ref = this.bbox;
        results = [];
        for (k = 0, len1 = ref.length; k < len1; k++) {
          b = ref[k];
          results.push(b === -0 ? 0 : b);
        }
        return results;
      }).call(this);
    }
  };

  MacroTool.prototype.getNumber = function(s) {
    if (s.match(/^[+-]?[\d.]+$/)) {
      return Number(s);
    } else if (s.match(/^\$\d+$/)) {
      return Number(this.modifiers[s]);
    } else {
      return this.evaluate(calc.parse(s));
    }
  };

  MacroTool.prototype.evaluate = function(op) {
    switch (op.type) {
      case 'n':
        return this.getNumber(op.val);
      case '+':
        return this.evaluate(op.left) + this.evaluate(op.right);
      case '-':
        return this.evaluate(op.left) - this.evaluate(op.right);
      case 'x':
        return this.evaluate(op.left) * this.evaluate(op.right);
      case '/':
        return this.evaluate(op.left) / this.evaluate(op.right);
    }
  };

  return MacroTool;

})();

module.exports = MacroTool;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvbWlrZS9tZmFiL2dlcmJlci10by1zdmcvc3JjL21hY3JvLXRvb2wuY29mZmVlIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbWlrZS9tZmFiL2dlcmJlci10by1zdmcvc3JjL21hY3JvLXRvb2wuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUlBLElBQUE7O0FBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxjQUFSOztBQUVULElBQUEsR0FBTyxPQUFBLENBQVEsY0FBUjs7QUFFUCxNQUFBLEdBQVMsT0FBQSxDQUFRLGFBQVI7O0FBRVQsV0FBQSxHQUFjLE9BQUEsQ0FBUSxhQUFSLENBQXNCLENBQUM7O0FBRS9CO0VBRVMsbUJBQUMsTUFBRCxFQUFTLFlBQVQ7SUFFWCxJQUFDLENBQUEsU0FBRCxHQUFhO0lBRWIsSUFBQyxDQUFBLElBQUQsR0FBUSxNQUFPLENBQUEsQ0FBQSxDQUFHO0lBRWxCLElBQUMsQ0FBQSxNQUFELEdBQVUsTUFBTztJQUVqQixJQUFDLENBQUEsTUFBRCxHQUFVO0lBRVYsSUFBQyxDQUFBLEtBQUQsR0FBUztJQUVULElBQUMsQ0FBQSxZQUFELEdBQWdCO0lBRWhCLElBQUMsQ0FBQSxJQUFELEdBQVEsQ0FBRSxJQUFGLEVBQVEsSUFBUixFQUFjLElBQWQsRUFBb0IsSUFBcEI7SUFFUixJQUFDLENBQUEsTUFBRCxHQUFVO01BQUUsTUFBQSxFQUFRLFlBQVY7O0VBaEJDOztzQkFtQmIsR0FBQSxHQUFLLFNBQUMsSUFBRCxFQUFPLFNBQVA7QUFFSCxRQUFBOztNQUZVLFlBQVk7O0lBRXRCLElBQUMsQ0FBQSxZQUFELEdBQWdCO0lBQ2hCLElBQUMsQ0FBQSxNQUFELEdBQVU7SUFDVixJQUFDLENBQUEsS0FBRCxHQUFTO0lBQ1QsSUFBQyxDQUFBLElBQUQsR0FBUSxDQUFFLElBQUYsRUFBUSxJQUFSLEVBQWMsSUFBZCxFQUFvQixJQUFwQjtJQUNSLElBQUMsQ0FBQSxTQUFELEdBQWE7QUFDYixTQUFBLG1EQUFB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

},{"./macro-calc":7,"./pad-shapes":10,"./svg-coord":14,"./unique-id":15}],9:[function(require,module,exports){
var CKEY, DTAB, objToXml, repeat;

repeat = function(pattern, count) {
  var result;
  result = '';
  if (count === 0) {
    return '';
  }
  while (count > 1) {
    if (count & 1) {
      result += pattern;
    }
    count >>= 1;
    pattern += pattern;
  }
  return result + pattern;
};

CKEY = '_';

DTAB = '  ';

objToXml = function(obj, op) {
  var children, dec, decimals, elem, i, ind, j, key, len, nl, o, pre, ref, ref1, ref2, tb, v, val, xml;
  if (op == null) {
    op = {};
  }
  pre = op.pretty;
  ind = (ref = op.indent) != null ? ref : 0;
  dec = (ref1 = op.maxDec) != null ? ref1 : false;
  decimals = function(n) {
    if (typeof n === 'number') {
      return Number(n.toFixed(dec));
    } else {
      return n;
    }
  };
  nl = pre ? '\n' : '';
  tb = nl ? (typeof pre === 'string' ? pre : DTAB) : '';
  tb = repeat(tb, ind);
  xml = '';
  if (typeof obj === 'function') {
    obj = obj();
  }
  if (Array.isArray(obj)) {
    for (i = j = 0, len = obj.length; j < len; i = ++j) {
      o = obj[i];
      xml += (i !== 0 ? nl : '') + (objToXml(o, op));
    }
  } else if (typeof obj === 'object') {
    children = false;
    elem = Object.keys(obj)[0];
    if (elem != null) {
      xml = tb + "<" + elem;
      if (typeof obj[elem] === 'function') {
        obj[elem] = obj[elem]();
      }
      ref2 = obj[elem];
      for (key in ref2) {
        val = ref2[key];
        if (typeof val === 'function') {
          val = val();
        }
        if (key === CKEY) {
          children = val;
        } else {
          if (Array.isArray(val)) {
            if (dec) {
              val = (function() {
                var k, len1, results;
                results = [];
                for (k = 0, len1 = val.length; k < len1; k++) {
                  v = val[k];
                  results.push(decimals(v));
                }
                return results;
              })();
            }
            val = val.join(' ');
          }
          if (dec) {
            val = decimals(val);
          }
          xml += " " + key + "=\"" + val + "\"";
        }
      }
      if (children) {
        xml += '>' + nl + objToXml(children, {
          pretty: pre,
          indent: ind + 1
        });
      }
      if (obj[elem]._ != null) {
        xml += "" + nl + tb + "</" + elem + ">";
      } else {
        xml += '/>';
      }
    }
  } else {
    xml += obj + " ";
  }
  return xml;
};

module.exports = objToXml;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvbWlrZS9tZmFiL2dlcmJlci10by1zdmcvc3JjL29iai10by14bWwuY29mZmVlIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbWlrZS9tZmFiL2dlcmJlci10by1zdmcvc3JjL29iai10by14bWwuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUlBLElBQUE7O0FBQUEsTUFBQSxHQUFTLFNBQUMsT0FBRCxFQUFVLEtBQVY7QUFDUCxNQUFBO0VBQUEsTUFBQSxHQUFTO0VBQ1QsSUFBRyxLQUFBLEtBQVMsQ0FBWjtBQUFtQixXQUFPLEdBQTFCOztBQUNBLFNBQU0sS0FBQSxHQUFRLENBQWQ7SUFDRSxJQUFHLEtBQUEsR0FBUSxDQUFYO01BQWtCLE1BQUEsSUFBVSxRQUE1Qjs7SUFDQSxLQUFBLEtBQVU7SUFDVixPQUFBLElBQVc7RUFIYjtTQUlBLE1BQUEsR0FBUztBQVBGOztBQVNULElBQUEsR0FBTzs7QUFDUCxJQUFBLEdBQU87O0FBQ1AsUUFBQSxHQUFXLFNBQUUsR0FBRixFQUFPLEVBQVA7QUFFVCxNQUFBOztJQUZnQixLQUFLOztFQUVyQixHQUFBLEdBQU0sRUFBRSxDQUFDO0VBQ1QsR0FBQSxxQ0FBa0I7RUFDbEIsR0FBQSx1Q0FBa0I7RUFFbEIsUUFBQSxHQUFXLFNBQUMsQ0FBRDtJQUNULElBQUcsT0FBTyxDQUFQLEtBQVksUUFBZjthQUE2QixNQUFBLENBQU8sQ0FBQyxDQUFDLE9BQUYsQ0FBVSxHQUFWLENBQVAsRUFBN0I7S0FBQSxNQUFBO2FBQXVELEVBQXZEOztFQURTO0VBR1gsRUFBQSxHQUFRLEdBQUgsR0FBWSxJQUFaLEdBQXNCO0VBQzNCLEVBQUEsR0FBUSxFQUFILEdBQVcsQ0FBSSxPQUFPLEdBQVAsS0FBYyxRQUFqQixHQUErQixHQUEvQixHQUF3QyxJQUF6QyxDQUFYLEdBQStEO0VBQ3BFLEVBQUEsR0FBSyxNQUFBLENBQU8sRUFBUCxFQUFXLEdBQVg7RUFFTCxHQUFBLEdBQU07RUFFTixJQUFHLE9BQU8sR0FBUCxLQUFjLFVBQWpCO0lBQWlDLEdBQUEsR0FBTSxHQUFBLENBQUEsRUFBdkM7O0VBRUEsSUFBRyxLQUFLLENBQUMsT0FBTixDQUFjLEdBQWQsQ0FBSDtBQUNFLFNBQUEsNkNBQUE7O01BQ0UsR0FBQSxJQUFPLENBQUksQ0FBQSxLQUFPLENBQVYsR0FBaUIsRUFBakIsR0FBeUIsRUFBMUIsQ0FBQSxHQUFnQyxDQUFDLFFBQUEsQ0FBUyxDQUFULEVBQVksRUFBWixDQUFEO0FBRHpDLEtBREY7R0FBQSxNQUlLLElBQUcsT0FBTyxHQUFQLEtBQWMsUUFBakI7SUFFSCxRQUFBLEdBQVc7SUFFWCxJQUFBLEdBQU8sTUFBTSxDQUFDLElBQVAsQ0FBWSxHQUFaLENBQWlCLENBQUEsQ0FBQTtJQUN4QixJQUFHLFlBQUg7TUFDRSxHQUFBLEdBQVMsRUFBRCxHQUFJLEdBQUosR0FBTztNQUNmLElBQUcsT0FBTyxHQUFJLENBQUEsSUFBQSxDQUFYLEtBQW9CLFVBQXZCO1FBQXVDLEdBQUksQ0FBQSxJQUFBLENBQUosR0FBWSxHQUFJLENBQUEsSUFBQSxDQUFKLENBQUEsRUFBbkQ7O0FBRUE7QUFBQSxXQUFBLFdBQUE7O1FBQ0UsSUFBRyxPQUFPLEdBQVAsS0FBYyxVQUFqQjtVQUFpQyxHQUFBLEdBQU0sR0FBQSxDQUFBLEVBQXZDOztRQUNBLElBQUcsR0FBQSxLQUFPLElBQVY7VUFBb0IsUUFBQSxHQUFXLElBQS9CO1NBQUEsTUFBQTtVQUdFLElBQUcsS0FBSyxDQUFDLE9BQU4sQ0FBYyxHQUFkLENBQUg7WUFDRSxJQUFHLEdBQUg7Y0FBWSxHQUFBOztBQUFPO3FCQUFBLHVDQUFBOzsrQkFBQSxRQUFBLENBQVMsQ0FBVDtBQUFBOzttQkFBbkI7O1lBQ0EsR0FBQSxHQUFNLEdBQUcsQ0FBQyxJQUFKLENBQVMsR0FBVCxFQUZSOztVQUdBLElBQUcsR0FBSDtZQUFZLEdBQUEsR0FBTSxRQUFBLENBQVMsR0FBVCxFQUFsQjs7VUFDQSxHQUFBLElBQU8sR0FBQSxHQUFJLEdBQUosR0FBUSxLQUFSLEdBQWEsR0FBYixHQUFpQixLQVAxQjs7QUFGRjtNQVdBLElBQUcsUUFBSDtRQUFpQixHQUFBLElBQ2YsR0FBQSxHQUFNLEVBQU4sR0FBVyxRQUFBLENBQVMsUUFBVCxFQUFtQjtVQUFFLE1BQUEsRUFBUSxHQUFWO1VBQWUsTUFBQSxFQUFRLEdBQUEsR0FBTSxDQUE3QjtTQUFuQixFQURiOztNQUdBLElBQUcsbUJBQUg7UUFBcUIsR0FBQSxJQUFPLEVBQUEsR0FBRyxFQUFILEdBQVEsRUFBUixHQUFXLElBQVgsR0FBZSxJQUFmLEdBQW9CLElBQWhEO09BQUEsTUFBQTtRQUF3RCxHQUFBLElBQU8sS0FBL0Q7T0FsQkY7S0FMRztHQUFBLE1BQUE7SUF5QkEsR0FBQSxJQUFVLEdBQUQsR0FBSyxJQXpCZDs7U0EyQkw7QUFoRFM7O0FBa0RYLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIn0=

},{}],10:[function(require,module,exports){
var circle, lowerLeftRect, moire, outline, polygon, rect, thermal, unique, vector;

unique = require('./unique-id');

circle = function(p) {
  var r;
  if (p.dia == null) {
    throw new Error('circle function requires diameter');
  }
  if (p.cx == null) {
    throw new Error('circle function requires x center');
  }
  if (p.cy == null) {
    throw new Error('circle function requires y center');
  }
  r = p.dia / 2;
  return {
    shape: {
      circle: {
        cx: p.cx,
        cy: p.cy,
        r: r
      }
    },
    bbox: [p.cx - r, p.cy - r, p.cx + r, p.cy + r]
  };
};

rect = function(p) {
  var radius, rectangle, x, y;
  if (p.width == null) {
    throw new Error('rectangle requires width');
  }
  if (p.height == null) {
    throw new Error('rectangle requires height');
  }
  if (p.cx == null) {
    throw new Error('rectangle function requires x center');
  }
  if (p.cy == null) {
    throw new Error('rectangle function requires y center');
  }
  x = p.cx - p.width / 2;
  y = p.cy - p.height / 2;
  rectangle = {
    shape: {
      rect: {
        x: x,
        y: y,
        width: p.width,
        height: p.height
      }
    },
    bbox: [x, y, x + p.width, y + p.height]
  };
  if (p.obround) {
    radius = 0.5 * Math.min(p.width, p.height);
    rectangle.shape.rect.rx = radius;
    rectangle.shape.rect.ry = radius;
  }
  return rectangle;
};

polygon = function(p) {
  var i, j, points, r, ref, rx, ry, start, step, theta, x, xMax, xMin, y, yMax, yMin;
  if (p.dia == null) {
    throw new Error('polygon requires diameter');
  }
  if (p.verticies == null) {
    throw new Error('polygon requires verticies');
  }
  if (p.cx == null) {
    throw new Error('polygon function requires x center');
  }
  if (p.cy == null) {
    throw new Error('polygon function requires y center');
  }
  start = p.degrees != null ? p.degrees * Math.PI / 180 : 0;
  step = 2 * Math.PI / p.verticies;
  r = p.dia / 2;
  points = '';
  xMin = null;
  yMin = null;
  xMax = null;
  yMax = null;
  for (i = j = 0, ref = p.verticies; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
    theta = start + (i * step);
    rx = r * Math.cos(theta);
    ry = r * Math.sin(theta);
    if (Math.abs(rx) < 0.000000001) {
      rx = 0;
    }
    if (Math.abs(ry) < 0.000000001) {
      ry = 0;
    }
    x = p.cx + rx;
    y = p.cy + ry;
    if (x < xMin || xMin === null) {
      xMin = x;
    }
    if (x > xMax || xMax === null) {
      xMax = x;
    }
    if (y < yMin || yMin === null) {
      yMin = y;
    }
    if (y > yMax || yMax === null) {
      yMax = y;
    }
    points += " " + x + "," + y;
  }
  return {
    shape: {
      polygon: {
        points: points.slice(1)
      }
    },
    bbox: [xMin, yMin, xMax, yMax]
  };
};

vector = function(p) {
  var theta, xDelta, yDelta;
  if (p.x1 == null) {
    throw new Error('vector function requires start x');
  }
  if (p.y1 == null) {
    throw new Error('vector function requires start y');
  }
  if (p.x2 == null) {
    throw new Error('vector function requires end x');
  }
  if (p.y2 == null) {
    throw new Error('vector function requires end y');
  }
  if (p.width == null) {
    throw new Error('vector function requires width');
  }
  theta = Math.abs(Math.atan((p.y2 - p.y1) / (p.x2 - p.x1)));
  xDelta = p.width / 2 * Math.sin(theta);
  yDelta = p.width / 2 * Math.cos(theta);
  if (xDelta < 0.0000001) {
    xDelta = 0;
  }
  if (yDelta < 0.0000001) {
    yDelta = 0;
  }
  return {
    shape: {
      line: {
        x1: p.x1,
        x2: p.x2,
        y1: p.y1,
        y2: p.y2,
        'stroke-width': p.width,
        'stroke-linecap': 'butt'
      }
    },
    bbox: [(Math.min(p.x1, p.x2)) - xDelta, (Math.min(p.y1, p.y2)) - yDelta, (Math.max(p.x1, p.x2)) + xDelta, (Math.max(p.y1, p.y2)) + yDelta]
  };
};

lowerLeftRect = function(p) {
  if (p.width == null) {
    throw new Error('lower left rect requires width');
  }
  if (p.height == null) {
    throw new Error('lower left rect requires height');
  }
  if (p.x == null) {
    throw new Error('lower left rectangle requires x');
  }
  if (p.y == null) {
    throw new Error('lower left rectangle requires y');
  }
  return {
    shape: {
      rect: {
        x: p.x,
        y: p.y,
        width: p.width,
        height: p.height
      }
    },
    bbox: [p.x, p.y, p.x + p.width, p.y + p.height]
  };
};

outline = function(p) {
  var j, len, point, pointString, ref, x, xLast, xMax, xMin, y, yLast, yMax, yMin;
  if (!(Array.isArray(p.points) && p.points.length > 1)) {
    throw new Error('outline function requires points array');
  }
  xMin = null;
  yMin = null;
  xMax = null;
  yMax = null;
  pointString = '';
  ref = p.points;
  for (j = 0, len = ref.length; j < len; j++) {
    point = ref[j];
    if (!(Array.isArray(point) && point.length === 2)) {
      throw new Error('outline function requires points array');
    }
    x = point[0];
    y = point[1];
    if (x < xMin || xMin === null) {
      xMin = x;
    }
    if (x > xMax || xMax === null) {
      xMax = x;
    }
    if (y < yMin || yMin === null) {
      yMin = y;
    }
    if (y > yMax || yMax === null) {
      yMax = y;
    }
    pointString += " " + x + "," + y;
  }
  xLast = p.points[p.points.length - 1][0];
  yLast = p.points[p.points.length - 1][1];
  if (!(xLast === p.points[0][0] && yLast === p.points[0][1])) {
    throw new RangeError('last point must match first point of outline');
  }
  return {
    shape: {
      polygon: {
        points: pointString.slice(1)
      }
    },
    bbox: [xMin, yMin, xMax, yMax]
  };
};

moire = function(p) {
  var r, rings, shape;
  if (p.cx == null) {
    throw new Error('moiré requires x center');
  }
  if (p.cy == null) {
    throw new Error('moiré requires y center');
  }
  if (p.outerDia == null) {
    throw new Error('moiré requires outer diameter');
  }
  if (p.ringThx == null) {
    throw new Error('moiré requires ring thickness');
  }
  if (p.ringGap == null) {
    throw new Error('moiré requires ring gap');
  }
  if (p.maxRings == null) {
    throw new Error('moiré requires max rings');
  }
  if (p.crossLength == null) {
    throw new Error('moiré requires crosshair length');
  }
  if (p.crossThx == null) {
    throw new Error('moiré requires crosshair thickness');
  }
  shape = [
    {
      line: {
        x1: p.cx - p.crossLength / 2,
        y1: 0,
        x2: p.cx + p.crossLength / 2,
        y2: 0,
        'stroke-width': p.crossThx,
        'stroke-linecap': 'butt'
      }
    }, {
      line: {
        x1: 0,
        y1: p.cy - p.crossLength / 2,
        x2: 0,
        y2: p.cy + p.crossLength / 2,
        'stroke-width': p.crossThx,
        'stroke-linecap': 'butt'
      }
    }
  ];
  r = (p.outerDia - p.ringThx) / 2;
  rings = 0;
  while (r >= p.ringThx && rings < p.maxRings) {
    shape.push({
      circle: {
        cx: p.cx,
        cy: p.cy,
        r: r,
        fill: 'none',
        'stroke-width': p.ringThx
      }
    });
    rings++;
    r -= p.ringThx + p.ringGap;
  }
  r += 0.5 * p.ringThx;
  if (r > 0 && rings < p.maxRings) {
    shape.push({
      circle: {
        cx: p.cx,
        cy: p.cy,
        r: r
      }
    });
  }
  return {
    shape: shape,
    bbox: [Math.min(p.cx - p.crossLength / 2, p.cx - p.outerDia / 2), Math.min(p.cy - p.crossLength / 2, p.cy - p.outerDia / 2), Math.max(p.cx + p.crossLength / 2, p.cx + p.outerDia / 2), Math.max(p.cy + p.crossLength / 2, p.cy + p.outerDia / 2)]
  };
};

thermal = function(p) {
  var halfGap, maskId, outerR, r, thx, xMax, xMin, yMax, yMin;
  if (p.cx == null) {
    throw new Error('thermal requires x center');
  }
  if (p.cy == null) {
    throw new Error('thermal requires y center');
  }
  if (p.outerDia == null) {
    throw new Error('thermal requires outer diameter');
  }
  if (p.innerDia == null) {
    throw new Error('thermal requires inner diameter');
  }
  if (p.gap == null) {
    throw new Error('thermal requires gap');
  }
  maskId = "thermal-mask-" + (unique());
  thx = (p.outerDia - p.innerDia) / 2;
  outerR = p.outerDia / 2;
  r = outerR - thx / 2;
  xMin = p.cx - outerR;
  xMax = p.cx + outerR;
  yMin = p.cy - outerR;
  yMax = p.cy + outerR;
  halfGap = p.gap / 2;
  return {
    shape: [
      {
        mask: {
          id: maskId,
          _: [
            {
              circle: {
                cx: p.cx,
                cy: p.cy,
                r: outerR,
                fill: '#fff'
              }
            }, {
              rect: {
                x: xMin,
                y: -halfGap,
                width: p.outerDia,
                height: p.gap,
                fill: '#000'
              }
            }, {
              rect: {
                x: -halfGap,
                y: yMin,
                width: p.gap,
                height: p.outerDia,
                fill: '#000'
              }
            }
          ]
        }
      }, {
        circle: {
          cx: p.cx,
          cy: p.cy,
          r: r,
          fill: 'none',
          'stroke-width': thx,
          mask: "url(#" + maskId + ")"
        }
      }
    ],
    bbox: [xMin, yMin, xMax, yMax]
  };
};

module.exports = {
  circle: circle,
  rect: rect,
  polygon: polygon,
  vector: vector,
  lowerLeftRect: lowerLeftRect,
  outline: outline,
  moire: moire,
  thermal: thermal
};

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvbWlrZS9tZmFiL2dlcmJlci10by1zdmcvc3JjL3BhZC1zaGFwZXMuY29mZmVlIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbWlrZS9tZmFiL2dlcmJlci10by1zdmcvc3JjL3BhZC1zaGFwZXMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUlBLElBQUE7O0FBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxhQUFSOztBQUVULE1BQUEsR0FBUyxTQUFDLENBQUQ7QUFDUCxNQUFBO0VBQUEsSUFBTyxhQUFQO0FBQW1CLFVBQU0sSUFBSSxLQUFKLENBQVUsbUNBQVYsRUFBekI7O0VBQ0EsSUFBTyxZQUFQO0FBQWtCLFVBQU0sSUFBSSxLQUFKLENBQVUsbUNBQVYsRUFBeEI7O0VBQ0EsSUFBTyxZQUFQO0FBQWtCLFVBQU0sSUFBSSxLQUFKLENBQVUsbUNBQVYsRUFBeEI7O0VBRUEsQ0FBQSxHQUFJLENBQUMsQ0FBQyxHQUFGLEdBQVE7U0FDWjtJQUNFLEtBQUEsRUFBTztNQUFFLE1BQUEsRUFBUTtRQUFDLEVBQUEsRUFBSSxDQUFDLENBQUMsRUFBUDtRQUFXLEVBQUEsRUFBSSxDQUFDLENBQUMsRUFBakI7UUFBcUIsQ0FBQSxFQUFHLENBQXhCO09BQVY7S0FEVDtJQUVFLElBQUEsRUFBTSxDQUFFLENBQUMsQ0FBQyxFQUFGLEdBQU8sQ0FBVCxFQUFZLENBQUMsQ0FBQyxFQUFGLEdBQU8sQ0FBbkIsRUFBc0IsQ0FBQyxDQUFDLEVBQUYsR0FBTyxDQUE3QixFQUFnQyxDQUFDLENBQUMsRUFBRixHQUFPLENBQXZDLENBRlI7O0FBTk87O0FBV1QsSUFBQSxHQUFPLFNBQUMsQ0FBRDtBQUNMLE1BQUE7RUFBQSxJQUFPLGVBQVA7QUFBcUIsVUFBTSxJQUFJLEtBQUosQ0FBVSwwQkFBVixFQUEzQjs7RUFDQSxJQUFPLGdCQUFQO0FBQXNCLFVBQU0sSUFBSSxLQUFKLENBQVUsMkJBQVYsRUFBNUI7O0VBQ0EsSUFBTyxZQUFQO0FBQWtCLFVB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

},{"./unique-id":15}],11:[function(require,module,exports){
var Parser;

Parser = (function() {
  function Parser(formatOpts) {
    var ref, ref1;
    if (formatOpts == null) {
      formatOpts = {};
    }
    this.format = {
      zero: (ref = formatOpts.zero) != null ? ref : null,
      places: (ref1 = formatOpts.places) != null ? ref1 : null
    };
    if (this.format.places != null) {
      if ((!Array.isArray(this.format.places)) || this.format.places.length !== 2 || typeof this.format.places[0] !== 'number' || typeof this.format.places[1] !== 'number') {
        throw new Error('parser places format must be an array of two numbers');
      }
    }
    if (this.format.zero != null) {
      if (typeof this.format.zero !== 'string' || (this.format.zero !== 'L' && this.format.zero !== 'T')) {
        throw new Error("parser zero format must be either 'L' or 'T'");
      }
    }
  }

  return Parser;

})();

module.exports = Parser;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvbWlrZS9tZmFiL2dlcmJlci10by1zdmcvc3JjL3BhcnNlci5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvaG9tZS9taWtlL21mYWIvZ2VyYmVyLXRvLXN2Zy9zcmMvcGFyc2VyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxJQUFBOztBQUFNO0VBQ1MsZ0JBQUMsVUFBRDtBQUNYLFFBQUE7O01BRFksYUFBYTs7SUFDekIsSUFBQyxDQUFBLE1BQUQsR0FBVTtNQUNSLElBQUEsMENBQXdCLElBRGhCO01BRVIsTUFBQSw4Q0FBNEIsSUFGcEI7O0lBS1YsSUFBRywwQkFBSDtNQUNFLElBQUcsQ0FBQyxDQUFJLEtBQUssQ0FBQyxPQUFOLENBQWMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxNQUF0QixDQUFMLENBQUEsSUFDSCxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFmLEtBQTJCLENBRHhCLElBRUgsT0FBTyxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQU8sQ0FBQSxDQUFBLENBQXRCLEtBQThCLFFBRjNCLElBR0gsT0FBTyxJQUFDLENBQUEsTUFBTSxDQUFDLE1BQU8sQ0FBQSxDQUFBLENBQXRCLEtBQThCLFFBSDlCO0FBSUUsY0FBTSxJQUFJLEtBQUosQ0FBVSxzREFBVixFQUpSO09BREY7O0lBT0EsSUFBRyx3QkFBSDtNQUNFLElBQUcsT0FBTyxJQUFDLENBQUEsTUFBTSxDQUFDLElBQWYsS0FBeUIsUUFBekIsSUFDSCxDQUFDLElBQUMsQ0FBQSxNQUFNLENBQUMsSUFBUixLQUFrQixHQUFsQixJQUEwQixJQUFDLENBQUEsTUFBTSxDQUFDLElBQVIsS0FBa0IsR0FBN0MsQ0FEQTtBQUVFLGNBQU0sSUFBSSxLQUFKLENBQVUsOENBQVYsRUFGUjtPQURGOztFQWJXOzs7Ozs7QUFrQmYsTUFBTSxDQUFDLE9BQVAsR0FBaUIifQ==

},{}],12:[function(require,module,exports){
var ASSUMED_UNITS, HALF_PI, Macro, Plotter, THREEHALF_PI, TWO_PI, coordFactor, tool, unique;

unique = require('./unique-id');

Macro = require('./macro-tool');

tool = require('./standard-tool');

coordFactor = require('./svg-coord').factor;

HALF_PI = Math.PI / 2;

THREEHALF_PI = 3 * HALF_PI;

TWO_PI = 2 * Math.PI;

ASSUMED_UNITS = 'in';

Plotter = (function() {
  function Plotter(reader, parser, opts) {
    var ref, ref1;
    this.reader = reader;
    this.parser = parser;
    if (opts == null) {
      opts = {};
    }
    this.units = (ref = opts.units) != null ? ref : null;
    this.notation = (ref1 = opts.notation) != null ? ref1 : null;
    this.macros = {};
    this.tools = {};
    this.currentTool = '';
    this.defs = [];
    this.group = {
      g: {
        _: []
      }
    };
    this.polarity = 'D';
    this.current = [];
    this.stepRepeat = {
      x: 1,
      y: 1,
      i: 0,
      j: 0
    };
    this.srOverClear = false;
    this.srOverCurrent = [];
    this.mode = null;
    this.quad = null;
    this.lastOp = null;
    this.region = false;
    this.done = false;
    this.pos = {
      x: 0,
      y: 0
    };
    this.path = [];
    this.attr = {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': 0,
      stroke: '#000'
    };
    this.bbox = {
      xMin: 2e308,
      yMin: 2e308,
      xMax: -2e308,
      yMax: -2e308
    };
    this.layerBbox = {
      xMin: 2e308,
      yMin: 2e308,
      xMax: -2e308,
      yMax: -2e308
    };
  }

  Plotter.prototype.addTool = function(code, params) {
    var obj, t;
    if (this.tools[code] != null) {
      throw new Error("cannot reassign tool " + code);
    }
    if (params.macro != null) {
      t = this.macros[params.macro].run(code, params.mods);
    } else {
      t = tool(code, params);
    }
    this.tools[code] = {
      trace: t.trace,
      pad: (function() {
        var k, len, ref, results;
        ref = t.pad;
        results = [];
        for (k = 0, len = ref.length; k < len; k++) {
          obj = ref[k];
          results.push(obj);
        }
        return results;
      })(),
      flash: function(x, y) {
        return {
          use: {
            x: x,
            y: y,
            'xlink:href': "#" + t.padId
          }
        };
      },
      flashed: false,
      bbox: function(x, y) {
        if (x == null) {
          x = 0;
        }
        if (y == null) {
          y = 0;
        }
        return {
          xMin: x + t.bbox[0],
          yMin: y + t.bbox[1],
          xMax: x + t.bbox[2],
          yMax: y + t.bbox[3]
        };
      }
    };
    return this.changeTool(code);
  };

  Plotter.prototype.changeTool = function(code) {
    var ref;
    this.finishPath();
    if (this.region) {
      throw new Error('cannot change tool when in region mode');
    }
    if (this.tools[code] == null) {
      if (!((ref = this.parser) != null ? ref.fmat : void 0)) {
        throw new Error("tool " + code + " is not defined");
      }
    } else {
      return this.currentTool = code;
    }
  };

  Plotter.prototype.command = function(c) {
    var code, m, params, ref, ref1, state, val;
    if (c.macro != null) {
      m = new Macro(c.macro, this.parser.format.places);
      this.macros[m.name] = m;
      return;
    }
    ref = c.set;
    for (state in ref) {
      val = ref[state];
      if (state === 'region') {
        this.finishPath();
      }
      switch (state) {
        case 'currentTool':
          this.changeTool(val);
          break;
        case 'units':
        case 'notation':
          if (this[state] == null) {
            this[state] = val;
          }
          break;
        default:
          this[state] = val;
      }
    }
    if (c.tool != null) {
      ref1 = c.tool;
      for (code in ref1) {
        params = ref1[code];
        this.addTool(code, params);
      }
    }
    if (c.op != null) {
      this.operate(c.op);
    }
    if (c["new"] != null) {
      this.finishLayer();
      if (c["new"].layer != null) {
        return this.polarity = c["new"].layer;
      } else if (c["new"].sr != null) {
        this.finishSR();
        return this.stepRepeat = c["new"].sr;
      }
    }
  };

  Plotter.prototype.plot = function() {
    var block, ref;
    while (!this.done) {
      block = this.reader.nextBlock();
      if (block === false) {
        if (((ref = this.parser) != null ? ref.fmat : void 0) == null) {
          throw new Error('end of file encountered before required M02 command');
        } else {
          throw new Error('end of drill file encountered before M00/M30 command');
        }
      } else {
        this.command(this.parser.parseCommand(block));
      }
    }
    return this.finish();
  };

  Plotter.prototype.finish = function() {
    this.finishPath();
    this.finishLayer();
    this.finishSR();
    this.group.g.fill = 'currentColor';
    this.group.g.stroke = 'currentColor';
    return this.group.g.transform = "translate(0," + (this.bbox.yMin + this.bbox.yMax) + ") scale(1,-1)";
  };

  Plotter.prototype.finishSR = function() {
    var k, l, layer, len, m, maskId, n, ref, ref1, ref2, ref3, ref4, ref5, u, x, y;
    if (this.srOverClear && this.srOverCurrent) {
      maskId = "gerber-sr-mask_" + (unique());
      m = {
        mask: {
          color: '#000',
          id: maskId,
          _: []
        }
      };
      m.mask._.push({
        rect: {
          fill: '#fff',
          x: this.bbox.xMin,
          y: this.bbox.yMin,
          width: this.bbox.xMax - this.bbox.xMin,
          height: this.bbox.yMax - this.bbox.yMin
        }
      });
      for (x = k = 0, ref = this.stepRepeat.x * this.stepRepeat.i, ref1 = this.stepRepeat.i; ref1 > 0 ? k < ref : k > ref; x = k += ref1) {
        for (y = l = 0, ref2 = this.stepRepeat.y * this.stepRepeat.j, ref3 = this.stepRepeat.j; ref3 > 0 ? l < ref2 : l > ref2; y = l += ref3) {
          ref4 = this.srOverCurrent;
          for (n = 0, len = ref4.length; n < len; n++) {
            layer = ref4[n];
            u = {
              use: {}
            };
            if (x !== 0) {
              u.use.x = x;
            }
            if (y !== 0) {
              u.use.y = y;
            }
            u.use['xlink:href'] = '#' + ((ref5 = layer.C) != null ? ref5 : layer.D);
            if (layer.D != null) {
              u.use.fill = '#fff';
            }
            m.mask._.push(u);
          }
        }
      }
      this.srOverClear = false;
      this.srOverCurrent = [];
      this.defs.push(m);
      return this.group.g.mask = "url(#" + maskId + ")";
    }
  };

  Plotter.prototype.finishLayer = function() {
    var c, h, id, k, l, len, n, obj, ref, ref1, ref2, srId, u, w, x, y;
    this.finishPath();
    if (!this.current.length) {
      return;
    }
    if (this.stepRepeat.x > 1 || this.stepRepeat.y > 1) {
      srId = "gerber-sr_" + (unique());
      this.current = [
        {
          g: {
            id: srId,
            _: this.current
          }
        }
      ];
      if (this.srOverClear || this.stepRepeat.i < this.layerBbox.xMax - this.layerBbox.xMin || this.stepRepeat.j < this.layerBbox.yMax - this.layerBbox.yMin) {
        obj = {};
        obj[this.polarity] = srId;
        this.srOverCurrent.push(obj);
        if (this.polarity === 'C') {
          this.srOverClear = true;
          this.defs.push(this.current[0]);
        }
      }
      for (x = k = 0, ref = this.stepRepeat.x; 0 <= ref ? k < ref : k > ref; x = 0 <= ref ? ++k : --k) {
        for (y = l = 0, ref1 = this.stepRepeat.y; 0 <= ref1 ? l < ref1 : l > ref1; y = 0 <= ref1 ? ++l : --l) {
          if (!(x === 0 && y === 0)) {
            u = {
              use: {
                'xlink:href': "#" + srId
              }
            };
            if (x !== 0) {
              u.use.x = x * this.stepRepeat.i;
            }
            if (y !== 0) {
              u.use.y = y * this.stepRepeat.j;
            }
            this.current.push(u);
          }
        }
      }
      this.layerBbox.xMax += (this.stepRepeat.x - 1) * this.stepRepeat.i;
      this.layerBbox.yMax += (this.stepRepeat.y - 1) * this.stepRepeat.j;
    }
    this.addBbox(this.layerBbox, this.bbox);
    this.layerBbox = {
      xMin: 2e308,
      yMin: 2e308,
      xMax: -2e308,
      yMax: -2e308
    };
    if (this.polarity === 'D') {
      if (this.group.g.mask != null) {
        this.current.unshift(this.group);
      }
      if ((this.group.g.mask == null) && this.group.g._.length) {
        ref2 = this.current;
        for (n = 0, len = ref2.length; n < len; n++) {
          c = ref2[n];
          this.group.g._.push(c);
        }
      } else {
        this.group = {
          g: {
            _: this.current
          }
        };
      }
    } else if (this.polarity === 'C' && !this.srOverClear) {
      id = "gerber-mask_" + (unique());
      w = this.bbox.xMax - this.bbox.xMin;
      h = this.bbox.yMax - this.bbox.yMin;
      this.current.unshift({
        rect: {
          x: this.bbox.xMin,
          y: this.bbox.yMin,
          width: w,
          height: h,
          fill: '#fff'
        }
      });
      this.defs.push({
        mask: {
          id: id,
          color: '#000',
          _: this.current
        }
      });
      this.group.g.mask = "url(#" + id + ")";
    }
    return this.current = [];
  };

  Plotter.prototype.finishPath = function() {
    var key, p, ref, val;
    if (this.path.length) {
      p = {
        path: {}
      };
      if (this.region) {
        this.path.push('Z');
      } else {
        ref = this.tools[this.currentTool].trace;
        for (key in ref) {
          val = ref[key];
          p.path[key] = val;
        }
      }
      p.path.d = this.path;
      this.current.push(p);
      return this.path = [];
    }
  };

  Plotter.prototype.operate = function(op) {
    var bbox, ex, ey, k, len, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, shape, sx, sy, t;
    if (op["do"] === 'last') {
      op["do"] = this.lastOp;
      console.warn('modal operation codes are deprecated');
    } else {
      this.lastOp = op["do"];
    }
    sx = this.pos.x;
    sy = this.pos.y;
    if (this.notation === 'I') {
      this.pos.x += (ref = op.x) != null ? ref : 0;
      this.pos.y += (ref1 = op.y) != null ? ref1 : 0;
    } else {
      this.pos.x = (ref2 = op.x) != null ? ref2 : this.pos.x;
      this.pos.y = (ref3 = op.y) != null ? ref3 : this.pos.y;
    }
    ex = this.pos.x;
    ey = this.pos.y;
    t = this.tools[this.currentTool];
    if (this.units == null) {
      if (this.backupUnits != null) {
        this.units = this.backupUnits;
        console.warn("units set to '" + this.units + "' according to deprecated command G7" + (this.units === 'in' ? 0 : 1));
      } else {
        this.units = ASSUMED_UNITS;
        console.warn('no units set; assuming inches');
      }
    }
    if (this.notation == null) {
      if (((ref4 = this.parser) != null ? ref4.fmat : void 0) != null) {
        this.notation = 'A';
      } else {
        throw new Error('format has not been set');
      }
    }
    if (op["do"] === 'move' && this.path.length) {
      return this.path.push('M', ex, ey);
    } else if (op["do"] === 'flash') {
      this.finishPath();
      if (this.region) {
        throw new Error('cannot flash while in region mode');
      }
      if (!t.flashed) {
        ref5 = t.pad;
        for (k = 0, len = ref5.length; k < len; k++) {
          shape = ref5[k];
          this.defs.push(shape);
        }
        t.flashed = true;
      }
      this.current.push(t.flash(ex, ey));
      return this.addBbox(t.bbox(ex, ey), this.layerBbox);
    } else if (op["do"] === 'int') {
      if (!this.region && !t.trace) {
        throw new Error(this.currentTool + " is not a strokable tool");
      }
      if (this.path.length === 0) {
        this.path.push('M', sx, sy);
        bbox = !this.region ? t.bbox(sx, sy) : {
          xMin: sx,
          yMin: sy,
          xMax: sx,
          yMax: sy
        };
        this.addBbox(bbox, this.layerBbox);
      }
      if (this.mode == null) {
        this.mode = 'i';
        console.warn('no interpolation mode set. Assuming linear (G01)');
      }
      if (this.mode === 'i') {
        return this.drawLine(sx, sy, ex, ey);
      } else {
        return this.drawArc(sx, sy, ex, ey, (ref6 = op.i) != null ? ref6 : 0, (ref7 = op.j) != null ? ref7 : 0);
      }
    }
  };

  Plotter.prototype.drawLine = function(sx, sy, ex, ey) {
    var bbox, exm, exp, eym, eyp, halfHeight, halfWidth, sxm, sxp, sym, syp, t, theta;
    t = this.tools[this.currentTool];
    bbox = !this.region ? t.bbox(ex, ey) : {
      xMin: ex,
      yMin: ey,
      xMax: ex,
      yMax: ey
    };
    this.addBbox(bbox, this.layerBbox);
    if (this.region || t.trace['stroke-width'] >= 0) {
      return this.path.push('L', ex, ey);
    } else {
      halfWidth = t.pad[0].rect.width / 2;
      halfHeight = t.pad[0].rect.height / 2;
      sxm = sx - halfWidth;
      sxp = sx + halfWidth;
      sym = sy - halfHeight;
      syp = sy + halfHeight;
      exm = ex - halfWidth;
      exp = ex + halfWidth;
      eym = ey - halfHeight;
      eyp = ey + halfHeight;
      theta = Math.atan2(ey - sy, ex - sx);
      if ((0 <= theta && theta < HALF_PI)) {
        return this.path.push('M', sxm, sym, sxp, sym, exp, eym, exp, eyp, exm, eyp, sxm, syp, 'Z');
      } else if ((HALF_PI <= theta && theta <= Math.PI)) {
        return this.path.push('M', sxm, sym, sxp, sym, sxp, syp, exp, eyp, exm, eyp, exm, eym, 'Z');
      } else if ((-Math.PI <= theta && theta < -HALF_PI)) {
        return this.path.push('M', sxp, sym, sxp, syp, sxm, syp, exm, eyp, exm, eym, exp, eym, 'Z');
      } else if ((-HALF_PI <= theta && theta < 0)) {
        return this.path.push('M', sxm, sym, exm, eym, exp, eym, exp, eyp, sxp, syp, sxm, syp, 'Z');
      }
    }
  };

  Plotter.prototype.drawArc = function(sx, sy, ex, ey, i, j) {
    var arcEps, c, cen, dist, k, l, large, len, len1, r, rTool, ref, ref1, ref2, sweep, t, theta, thetaE, thetaS, validCen, xMax, xMin, xn, xp, yMax, yMin, yn, yp, zeroLength;
    arcEps = 1.5 * coordFactor * Math.pow(10, -1 * ((ref = (ref1 = this.parser) != null ? ref1.format.places[1] : void 0) != null ? ref : 7));
    t = this.tools[this.currentTool];
    if (!this.region && !t.trace['stroke-width']) {
      throw Error("cannot stroke an arc with non-circular tool " + this.currentTool);
    }
    if (this.quad == null) {
      throw new Error('arc quadrant mode has not been set');
    }
    r = Math.sqrt(Math.pow(i, 2) + Math.pow(j, 2));
    sweep = this.mode === 'cw' ? 0 : 1;
    large = 0;
    validCen = [];
    if (this.quad === 's') {
      cand = [];
      cand.push([sx + i, sy + j], [sx - i, sy - j], [sx - i, sy + j], [sx + i, sy - j]);
      for (k = 0, len = cand.length; k < len; k++) {
        c = cand[k];
        dist = Math.sqrt(Math.pow(c[0] - ex, 2) + Math.pow(c[1] - ey, 2));
        if ((Math.abs(r - dist)) < arcEps) {
          validCen.push({
            x: c[0],
            y: c[1]
          });
        }
      }
    } else {
      validCen.push({
        x: sx + i,
        y: sy + j
      });
    }
    thetaE = 0;
    thetaS = 0;
    cen = null;
    for (l = 0, len1 = validCen.length; l < len1; l++) {
      c = validCen[l];
      thetaE = Math.atan2(ey - c.y, ex - c.x);
      if (thetaE < 0) {
        thetaE += TWO_PI;
      }
      thetaS = Math.atan2(sy - c.y, sx - c.x);
      if (thetaS < 0) {
        thetaS += TWO_PI;
      }
      if (this.mode === 'cw' && thetaS < thetaE) {
        thetaS += TWO_PI;
      } else if (this.mode === 'ccw' && thetaE < thetaS) {
        thetaE += TWO_PI;
      }
      theta = Math.abs(thetaE - thetaS);
      if (this.quad === 's' && theta <= HALF_PI) {
        cen = c;
      } else if (this.quad === 'm') {
        if (theta >= Math.PI) {
          large = 1;
        }
        cen = {
          x: c.x,
          y: c.y
        };
      }
      if (cen != null) {
        break;
      }
    }
    if (cen == null) {
      console.warn("start " + sx + "," + sy + " " + this.mode + " to end " + ex + "," + ey + " with center offset " + i + "," + j + " is an impossible arc in " + (this.quad === 's' ? 'single' : 'multi') + " quadrant mode with epsilon set to " + arcEps);
      return;
    }
    rTool = this.region ? 0 : t.bbox().xMax;
    if (this.mode === 'cw') {
      ref2 = [thetaS, thetaE], thetaE = ref2[0], thetaS = ref2[1];
    }
    xp = thetaS > 0 ? TWO_PI : 0;
    yp = HALF_PI + (thetaS > HALF_PI ? TWO_PI : 0);
    xn = Math.PI + (thetaS > Math.PI ? TWO_PI : 0);
    yn = THREEHALF_PI + (thetaS > THREEHALF_PI ? TWO_PI : 0);
    if ((thetaS <= xn && xn <= thetaE)) {
      xMin = cen.x - r - rTool;
    } else {
      xMin = (Math.min(sx, ex)) - rTool;
    }
    if ((thetaS <= xp && xp <= thetaE)) {
      xMax = cen.x + r + rTool;
    } else {
      xMax = (Math.max(sx, ex)) + rTool;
    }
    if ((thetaS <= yn && yn <= thetaE)) {
      yMin = cen.y - r - rTool;
    } else {
      yMin = (Math.min(sy, ey)) - rTool;
    }
    if ((thetaS <= yp && yp <= thetaE)) {
      yMax = cen.y + r + rTool;
    } else {
      yMax = (Math.max(sy, ey)) + rTool;
    }
    zeroLength = (Math.abs(sx - ex) < arcEps) && (Math.abs(sy - ey) < arcEps);
    if (this.quad === 'm' && zeroLength) {
      this.path.push('A', r, r, 0, 0, sweep, ex + 2 * i, ey + 2 * j);
      xMin = cen.x - r - rTool;
      yMin = cen.y - r - rTool;
      xMax = cen.x + r + rTool;
      yMax = cen.y + r + rTool;
    }
    this.path.push('A', r, r, 0, large, sweep, ex, ey);
    if (this.quad === 's' && zeroLength) {
      this.path.push('Z');
    }
    return this.addBbox({
      xMin: xMin,
      yMin: yMin,
      xMax: xMax,
      yMax: yMax
    }, this.layerBbox);
  };

  Plotter.prototype.addBbox = function(bbox, target) {
    if (bbox.xMin < target.xMin) {
      target.xMin = bbox.xMin;
    }
    if (bbox.yMin < target.yMin) {
      target.yMin = bbox.yMin;
    }
    if (bbox.xMax > target.xMax) {
      target.xMax = bbox.xMax;
    }
    if (bbox.yMax > target.yMax) {
      return target.yMax = bbox.yMax;
    }
  };

  return Plotter;

})();

module.exports = Plotter;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvbWlrZS9tZmFiL2dlcmJlci10by1zdmcvc3JjL3Bsb3R0ZXIuY29mZmVlIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbWlrZS9tZmFiL2dlcmJlci10by1zdmcvc3JjL3Bsb3R0ZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBLElBQUE7O0FBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxhQUFSOztBQUVULEtBQUEsR0FBUSxPQUFBLENBQVEsY0FBUjs7QUFFUixJQUFBLEdBQU8sT0FBQSxDQUFRLGlCQUFSOztBQUVQLFdBQUEsR0FBYyxPQUFBLENBQVEsYUFBUixDQUFzQixDQUFDOztBQUdyQyxPQUFBLEdBQVUsSUFBSSxDQUFDLEVBQUwsR0FBVTs7QUFDcEIsWUFBQSxHQUFlLENBQUEsR0FBSTs7QUFDbkIsTUFBQSxHQUFTLENBQUEsR0FBSSxJQUFJLENBQUM7O0FBRWxCLGFBQUEsR0FBZ0I7O0FBRVY7RUFFUyxpQkFBQyxNQUFELEVBQVUsTUFBVixFQUFtQixJQUFuQjtBQUdYLFFBQUE7SUFIWSxJQUFDLENBQUEsU0FBRDtJQUFTLElBQUMsQ0FBQSxTQUFEOztNQUFTLE9BQU87O0lBR3JDLElBQUMsQ0FBQSxLQUFELHNDQUFzQjtJQUN0QixJQUFDLENBQUEsUUFBRCwyQ0FBNEI7SUFFNUIsSUFBQyxDQUFBLE1BQUQsR0FBVTtJQUNWLElBQUMsQ0FBQSxLQUFELEdBQVM7SUFDVCxJQUFDLENBQUEsV0FBRCxHQUFlO0lBRWYsSUFBQyxDQUFBLElBQUQsR0FBUTtJQUNSLElBQUMsQ0FBQSxLQUFELEdBQVM7TUFBRSxDQUFBLEVBQUc7UUFBRSxDQUFBLEVBQUcsRUFBTDtPQUFMOztJQUVULElBQUMsQ0FBQSxRQUFELEdBQVk7SUFDWixJQUFDLENBQUEsT0FBRCxHQUFXO0lBRVgsSUFBQyxDQUFBLFVBQUQsR0FBYztNQUFFLENBQUEsRUFBRyxDQUFMO01BQVEsQ0FBQSxFQUFHLENBQVg7TUFBYyxDQUFBLEVBQUcsQ0FB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

},{"./macro-tool":8,"./standard-tool":13,"./svg-coord":14,"./unique-id":15}],13:[function(require,module,exports){
var shapes, standardTool, unique;

unique = require('./unique-id');

shapes = require('./pad-shapes');

standardTool = function(tool, p) {
  var hole, id, mask, maskId, pad, result, shape;
  result = {
    pad: [],
    trace: false
  };
  p.cx = 0;
  p.cy = 0;
  id = "tool-" + tool + "-pad-" + (unique());
  shape = '';
  if ((p.dia != null) && (p.verticies == null)) {
    if ((p.obround != null) || (p.width != null) || (p.height != null) || (p.degrees != null)) {
      throw new Error("incompatible parameters for tool " + tool);
    }
    if (p.dia < 0) {
      throw new RangeError(tool + " circle diameter out of range (" + p.dia + "<0)");
    }
    shape = 'circle';
    result.trace = {
      'stroke-width': p.dia,
      fill: 'none'
    };
  } else if ((p.width != null) && (p.height != null)) {
    if ((p.dia != null) || (p.verticies != null) || (p.degrees != null)) {
      throw new Error("incompatible parameters for tool " + tool);
    }
    if (p.width < 0) {
      throw new RangeError(tool + " rect width out of range (" + p.width + "<0)");
    }
    if (p.height < 0) {
      throw new RangeError(tool + " rect height out of range (" + p.height + "<0)");
    }
    shape = 'rect';
    if ((p.width === 0 || p.height === 0) && !p.obround) {
      console.warn("zero-size rectangle tools are not allowed; converting " + tool + " to a zero-size circle");
      shape = 'circle';
      p.dia = 0;
    }
    if (!((p.hole != null) || p.obround)) {
      result.trace = {};
    }
  } else if ((p.dia != null) && (p.verticies != null)) {
    if ((p.obround != null) || (p.width != null) || (p.height != null)) {
      throw new Error("incompatible parameters for tool " + tool);
    }
    if (p.verticies < 3 || p.verticies > 12) {
      throw new RangeError(tool + " polygon points out of range (" + p.verticies + "<3 or >12)]");
    }
    shape = 'polygon';
  } else {
    throw new Error('unidentified standard tool shape');
  }
  pad = shapes[shape](p);
  if (p.hole != null) {
    hole = null;
    if ((p.hole.dia != null) && (p.hole.width == null) && (p.hole.height == null)) {
      if (!(p.hole.dia >= 0)) {
        throw new RangeError(tool + " hole diameter out of range (" + p.hole.dia + "<0)");
      }
      hole = shapes.circle({
        cx: p.cx,
        cy: p.cy,
        dia: p.hole.dia
      });
      hole = hole.shape;
      hole.circle.fill = '#000';
    } else if ((p.hole.width != null) && (p.hole.height != null)) {
      if (!(p.hole.width >= 0)) {
        throw new RangeError(tool + " hole width out of range (" + p.hole.width + "<0)");
      }
      if (!(p.hole.height >= 0)) {
        throw new RangeError(tool + " hole height out of range (" + p.hole.height + "<0)");
      }
      hole = shapes.rect({
        cx: p.cx,
        cy: p.cy,
        width: p.hole.width,
        height: p.hole.height
      });
      hole = hole.shape;
      hole.rect.fill = '#000';
    } else {
      throw new Error(tool + " has invalid hole parameters");
    }
    maskId = id + '-mask';
    mask = {
      mask: {
        id: id + '-mask',
        _: [
          {
            rect: {
              x: pad.bbox[0],
              y: pad.bbox[1],
              width: pad.bbox[2] - pad.bbox[0],
              height: pad.bbox[3] - pad.bbox[1],
              fill: '#fff'
            }
          }, hole
        ]
      }
    };
    pad.shape[shape].mask = "url(#" + maskId + ")";
    result.pad.push(mask);
  }
  if (id) {
    pad.shape[shape].id = id;
  }
  result.pad.push(pad.shape);
  result.bbox = pad.bbox;
  result.padId = id;
  return result;
};

module.exports = standardTool;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvbWlrZS9tZmFiL2dlcmJlci10by1zdmcvc3JjL3N0YW5kYXJkLXRvb2wuY29mZmVlIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvbWlrZS9tZmFiL2dlcmJlci10by1zdmcvc3JjL3N0YW5kYXJkLXRvb2wuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQU1BLElBQUE7O0FBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxhQUFSOztBQUVULE1BQUEsR0FBUyxPQUFBLENBQVEsY0FBUjs7QUFFVCxZQUFBLEdBQWUsU0FBQyxJQUFELEVBQU8sQ0FBUDtBQUNiLE1BQUE7RUFBQSxNQUFBLEdBQVM7SUFBRSxHQUFBLEVBQUssRUFBUDtJQUFXLEtBQUEsRUFBTyxLQUFsQjs7RUFFVCxDQUFDLENBQUMsRUFBRixHQUFPO0VBQ1AsQ0FBQyxDQUFDLEVBQUYsR0FBTztFQUVQLEVBQUEsR0FBSyxPQUFBLEdBQVEsSUFBUixHQUFhLE9BQWIsR0FBbUIsQ0FBQyxNQUFBLENBQUEsQ0FBRDtFQUV4QixLQUFBLEdBQVE7RUFDUixJQUFHLGVBQUEsSUFBZSxxQkFBbEI7SUFFRSxJQUFHLG1CQUFBLElBQWMsaUJBQWQsSUFBMEIsa0JBQTFCLElBQXVDLG1CQUExQztBQUNFLFlBQU0sSUFBSSxLQUFKLENBQVUsbUNBQUEsR0FBb0MsSUFBOUMsRUFEUjs7SUFHQSxJQUFHLENBQUMsQ0FBQyxHQUFGLEdBQVEsQ0FBWDtBQUNFLFlBQU0sSUFBSSxVQUFKLENBQWtCLElBQUQsR0FBTSxpQ0FBTixHQUF1QyxDQUFDLENBQUMsR0FBekMsR0FBNkMsS0FBOUQsRUFEUjs7SUFHQSxLQUFBLEdBQVE7SUFDUixNQUFNLENBQUMsS0FBUCxHQUFlO01BQ2IsY0FBQSxFQUFnQixDQUFDLENBQUMsR0FETDtNQUViLElBQUEsRUFBTSxNQUZPO01BVGpCO0dBQUEsTUFjSyxJQUFHLGlCQUFBLElBQWEsa0JBQWhCO0lBRUgsSUFBRyxlQUFBLElBQVUscUJBQVYsSUFBMEIs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

},{"./pad-shapes":10,"./unique-id":15}],14:[function(require,module,exports){
var SVG_COORD_E, getSvgCoord,
  indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

SVG_COORD_E = 3;

getSvgCoord = function(numberString, format) {
  var after, before, c, i, j, k, len, len1, ref, ref1, ref2, ref3, sign, subNumbers;
  if (numberString != null) {
    numberString = "" + numberString;
  } else {
    return 0/0;
  }
  before = '';
  after = '';
  sign = '+';
  if (numberString[0] === '-' || numberString[0] === '+') {
    sign = numberString[0];
    numberString = numberString.slice(1);
  }
  if ((indexOf.call(numberString, '.') >= 0) || (format.zero == null)) {
    subNumbers = numberString.split('.');
    if (subNumbers.length > 2) {
      return 0/0;
    }
    ref1 = [subNumbers[0], (ref = subNumbers[1]) != null ? ref : ''], before = ref1[0], after = ref1[1];
  } else {
    if (typeof (format != null ? (ref2 = format.places) != null ? ref2[0] : void 0 : void 0) !== 'number' || typeof (format != null ? (ref3 = format.places) != null ? ref3[1] : void 0 : void 0) !== 'number') {
      return 0/0;
    }
    if (format.zero === 'T') {
      for (i = j = 0, len = numberString.length; j < len; i = ++j) {
        c = numberString[i];
        if (i < format.places[0]) {
          before += c;
        } else {
          after += c;
        }
      }
      while (before.length < format.places[0]) {
        before += '0';
      }
    } else if (format.zero === 'L') {
      for (i = k = 0, len1 = numberString.length; k < len1; i = ++k) {
        c = numberString[i];
        if (numberString.length - i <= format.places[1]) {
          after += c;
        } else {
          before += c;
        }
      }
      while (after.length < format.places[1]) {
        after = '0' + after;
      }
    }
  }
  while (after.length < SVG_COORD_E) {
    after += '0';
  }
  before = before + after.slice(0, SVG_COORD_E);
  after = after.length > SVG_COORD_E ? "." + after.slice(SVG_COORD_E) : '';
  return Number(sign + before + after);
};

module.exports = {
  get: getSvgCoord,
  factor: Math.pow(10, SVG_COORD_E)
};

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvbWlrZS9tZmFiL2dlcmJlci10by1zdmcvc3JjL3N2Zy1jb29yZC5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvaG9tZS9taWtlL21mYWIvZ2VyYmVyLXRvLXN2Zy9zcmMvc3ZnLWNvb3JkLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQSxJQUFBLHdCQUFBO0VBQUE7O0FBQUEsV0FBQSxHQUFjOztBQUdkLFdBQUEsR0FBYyxTQUFFLFlBQUYsRUFBZ0IsTUFBaEI7QUFFWixNQUFBO0VBQUEsSUFBRyxvQkFBSDtJQUFzQixZQUFBLEdBQWUsRUFBQSxHQUFHLGFBQXhDO0dBQUEsTUFBQTtBQUE0RCxXQUFPLElBQW5FOztFQUdBLE1BQUEsR0FBUztFQUNULEtBQUEsR0FBUTtFQUNSLElBQUEsR0FBTztFQUNQLElBQUcsWUFBYSxDQUFBLENBQUEsQ0FBYixLQUFtQixHQUFuQixJQUEwQixZQUFhLENBQUEsQ0FBQSxDQUFiLEtBQW1CLEdBQWhEO0lBQ0UsSUFBQSxHQUFPLFlBQWEsQ0FBQSxDQUFBO0lBQ3BCLFlBQUEsR0FBZSxZQUFhLFVBRjlCOztFQUtBLElBQUcsQ0FBQyxhQUFPLFlBQVAsRUFBQSxHQUFBLE1BQUQsQ0FBQSxJQUF5QixDQUFLLG1CQUFMLENBQTVCO0lBRUUsVUFBQSxHQUFhLFlBQVksQ0FBQyxLQUFiLENBQW1CLEdBQW5CO0lBQ2IsSUFBRyxVQUFVLENBQUMsTUFBWCxHQUFvQixDQUF2QjtBQUE4QixhQUFPLElBQXJDOztJQUNBLE9BQWtCLENBQUMsVUFBVyxDQUFBLENBQUEsQ0FBWix3Q0FBZ0MsRUFBaEMsQ0FBbEIsRUFBQyxnQkFBRCxFQUFTLGdCQUpYO0dBQUEsTUFBQTtJQVFFLElBQUcsOERBQXVCLENBQUEsQ0FBQSxvQkFBdkIsS0FBK0IsUUFBL0IsSUFDSCw4REFBdUIsQ0FBQSxDQUFBLG9CQUF2QixLQUErQixRQUQvQjtBQUVFLGFBQU8sSUFGVDs7SUFJQSxJQUFHLE1BQU0sQ0FBQyxJQUFQLEtBQWUsR0FBbEI7QUFDRSxXQUFBLHNEQUFBOztRQUNFLElBQUcsQ0FBQSxHQUFJLE1BQU0sQ0FBQyxNQUFPLENBQUEsQ0FBQSxDQUFyQjtVQUE2QixNQUFBLElBQVUsRUFBdkM7U0FBQSxNQUFBO1VBQThDLEtBQUEsSUFBUyxFQUF2RDs7QUFERjtBQUdjLGFBQU0sTUFBTSxDQUFDLE1BQVAsR0FBZ0IsTUFBTSxDQUFDLE1BQU8sQ0FBQSxDQUFBLENBQXBDO1FBQWQsTUFBQSxJQUFVO01BQUksQ0FKaEI7S0FBQSxNQUtLLElBQUcsTUFBTSxDQUFDLElBQVAsS0FBZSxHQUFsQjtBQUNILFdBQUEsd0RBQUE7O1FBQ0UsSUFBRyxZQUFZLENBQUMsTUFBYixHQUFzQixDQUF0QixJQUEyQixNQUFNLENBQUMsTUFBTyxDQUFBLENBQUEsQ0FBNUM7VUFDRSxLQUFBLElBQVMsRUFEWDtTQUFBLE1BQUE7VUFHRSxNQUFBLElBQVUsRUFIWjs7QUFERjtBQU1zQixhQUFNLEtBQUssQ0FBQyxNQUFOLEdBQWUsTUFBTSxDQUFDLE1BQU8sQ0FBQSxDQUFBLENBQW5DO1FBQXRCLEtBQUEsR0FBUyxHQUFBLEdBQU07TUFBTyxDQVBuQjtLQWpCUDs7QUE0QmEsU0FBTSxLQUFLLENBQUMsTUFBTixHQUFlLFdBQXJCO0lBQWIsS0FBQSxJQUFTO0VBQUk7RUFFYixNQUFBLEdBQVMsTUFBQSxHQUFTLEtBQU07RUFDeEIsS0FBQSxHQUFXLEtBQUssQ0FBQyxNQUFOLEdBQWUsV0FBbEIsR0FBbUMsR0FBQSxHQUFJLEtBQU0sbUJBQTdDLEdBQW1FO1NBRzNFLE1BQUEsQ0FBTyxJQUFBLEdBQU8sTUFBUCxHQUFnQixLQUF2QjtBQS9DWTs7QUFrRGQsTUFBTSxDQUFDLE9BQVAsR0FBaUI7RUFBRSxHQUFBLEVBQUssV0FBUDtFQUFvQixNQUFBLFdBQVEsSUFBTSxZQUFsQyJ9

},{}],15:[function(require,module,exports){
var generateUniqueId, id;

id = 1000;

generateUniqueId = function() {
  return id++;
};

module.exports = generateUniqueId;

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiL2hvbWUvbWlrZS9tZmFiL2dlcmJlci10by1zdmcvc3JjL3VuaXF1ZS1pZC5jb2ZmZWUiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIvaG9tZS9taWtlL21mYWIvZ2VyYmVyLXRvLXN2Zy9zcmMvdW5pcXVlLWlkLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQSxJQUFBOztBQUFBLEVBQUEsR0FBSzs7QUFFTCxnQkFBQSxHQUFtQixTQUFBO1NBQ2pCLEVBQUE7QUFEaUI7O0FBR25CLE1BQU0sQ0FBQyxPQUFQLEdBQWlCIn0=

},{}]},{},[1])(1)
});