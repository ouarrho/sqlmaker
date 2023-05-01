const fs = require('fs');
const yaml = require('js-yaml');
const xml2js = require('xml2js');

/**
 * The Parser class provides utility methods to parse different file formats.
 * It supports JSON, XML, and YAML formats.
 */
class Parser {
  /**
   * Parses the content of a file based on its extension.
   * @param {string} path - The path to the file.
   * @returns {object} - The parsed data.
   * @throws {Error} - If the file is not found or the format is unsupported.
   */
  file(path) {
    const content = fs.readFileSync(path, 'utf8');
    const ext = path.split('.').pop();

    switch (ext) {
      case 'json':
        return this.json(content);
      case 'xml':
        return this.xml(content);
      case 'yaml':
      case 'yml':
        return this.yaml(content);
      default:
        throw new Error(`Unsupported file type: ${ext}`);
    }
  }

  /**
   * Parses a JSON string.
   * @param {string} content - The JSON content to parse.
   * @returns {object} - The parsed data.
   * @throws {Error} - If the JSON is invalid.
   */
  json(content) {
    try {
      return JSON.parse(content);
    } catch (err) {
      throw new Error('Invalid JSON: ' + err.message);
    }
  }

  /**
   * Parses an XML string.
   * @param {string} content - The XML content to parse.
   * @returns {Promise<object>} - The parsed data.
   * @throws {Error} - If the XML is invalid.
   */
  async xml(content) {
    const parser = new xml2js.Parser({ explicitArray: false });

    return new Promise((resolve, reject) => {
      parser.parseString(content, (err, result) => {
        if (err) {
          reject(new Error('Invalid XML: ' + err.message));
        } else {
          resolve(result);
        }
      });
    });
  }

  /**
   * Parses a YAML string.
   * @param {string} content - The YAML content to parse.
   * @returns {object} - The parsed data.
   * @throws {Error} - If the YAML is invalid.
   */
  yaml(content) {
    try {
      return yaml.load(content);
    } catch (err) {
      throw new Error('Invalid YAML: ' + err.message);
    }
  }
}

module.exports = Parser;
