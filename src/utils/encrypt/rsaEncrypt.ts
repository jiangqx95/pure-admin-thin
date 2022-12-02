import { JSEncrypt } from "jsencrypt";

const publicKey =
  "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBANL378k3RiZHWx5AfJqdH9xRNBmD9wGD\n" +
  "2iRe41HdTNF8RUhNnHit5NpMNtGL0NPTSSpPjjI1kJfVorRvaQerUgkCAwEAAQ==";

// rsa加密
export const rsaEncrypt = function (data: any) {
  const Je = new JSEncrypt({ default_key_size: "1024" });
  Je.setPublicKey(publicKey);
  if (data instanceof Object) {
    data = JSON.stringify(data);
  }
  return Je.encrypt(data);
};

// rsa解密
export const rsaDecrypt = function (data: string) {
  const Je = new JSEncrypt({ default_key_size: "1024" });
  Je.setPublicKey(publicKey);
  return Je.decrypt(data);
};
