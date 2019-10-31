module.exports = {
    "transform": {
      "^.+\\.(t|j)sx?$": "ts-jest"
    },
    "collectCoverageFrom" : ["src/**/*.ts"],
    "testRegex": "(/test/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
    "moduleFileExtensions": ["ts", "tsx", "js", "jsx", "json", "node"]
  }