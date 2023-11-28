let Token1=null;
let Token2=null;

async function handleToken1(token) {

    await new Promise(resolve => setTimeout(resolve, 1000));

    Token1 = token;
    return Token1;
}


async function handleToken2(token) {
    await new Promise(resolve => setTimeout(resolve, 1000));

    Token2 = token;

    return Token2;
}

async function Token11() {
    return new Promise(async (resolve, reject) => {
        if (Token1) {
            resolve(Token1);
        } else {
            const interval = setInterval(async () => {
                if (Token1) {
                    clearInterval(interval);
                    resolve(Token1);
                }
            }, 100);
        }
    });
}

function Token22() {
  return new Promise((resolve, reject) => {
      if (Token2) {
          resolve(Token2);
      } else {
          const interval = setInterval(() => {
              if (Token2) {
                  clearInterval(interval);
                  resolve(Token2);
              }
          }, 100); // Check every 100 milliseconds
      }
  });
}

module.exports = {
    handleToken1,
    Token11,
    handleToken2,
    Token22
};
