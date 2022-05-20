module.exports = {
    "env": {
        "es2021": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
    },
  "ignorePatterns": [
    "src/database/migrations/*.js",
    "src/database/seeders/*.js"
  ],
  "rules": {
    "prefer-const": 1,
    "no-var": 1,
    "no-unused-vars": 1,
      "max-len": [
        "error",
        {
          "code": 180
        }
      ],
      "no-console": 1,
      "no-extra-boolean-cast": 0,
    }
};
