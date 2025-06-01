import { BinaryComplexityRule } from "../types";

const binaryRules: Record<string, BinaryComplexityRule> = {
  wfd: {
    asLanguage: "WFD",
    extensions: [".wfd", ".WFD"],
    metric: "sizeInKB",
  },
};

export default binaryRules;
