import fs from "fs-extra";
import path from "path";

const start = async () => {
  await fs.emptyDir(path.resolve(__dirname, "../dist"), err => {
    if (err) {
      return console.error(err);
    }

    console.log("Cleared dist folder!");
  });
};

start();
