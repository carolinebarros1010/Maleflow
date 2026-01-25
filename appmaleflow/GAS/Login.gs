function _hashSenha(raw) {
  const senha = String(raw || "");
  if (!senha) return "";
  const digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    senha,
    Utilities.Charset.UTF_8
  );
  return Utilities.base64Encode(digest);
}

function _senhaConfere_(senhaDigitada, senhaSalva) {
  const senha = String(senhaDigitada || "");
  const hash = _hashSenha(senha);
  const salva = String(senhaSalva || "").trim();

  if (!salva) return true;
  if (!senha) return true;

  return salva === senha || salva === hash;
}

function _fazerLogin(data) {
  const sh = ensureSheet(SHEET_ALUNAS, HEADER_ALUNAS);
  if (!sh) return { status: "error", msg: "Aba Alunos não encontrada." };

  const email = String(data.email || "").trim().toLowerCase();
  const senha = String(data.senha || "").trim();
  const deviceId = String(data.deviceId || "").trim();

  if (!email) return { status: "error", msg: "email_required" };

  const rows = sh.getDataRange().getValues();

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const emailDB = String(row[2] || "").trim().toLowerCase();

    if (emailDB !== email) continue;

    if (!_senhaConfere_(senha, row[4])) {
      return { status: "senha_incorreta" };
    }

    const linha = i + 1;
    const deviceDB = String(row[COL_DEVICE_ID] || "").trim();
    let deviceUpdated = false;

    if (deviceDB && deviceId && deviceDB !== deviceId) {
      return { status: "blocked" };
    }

    if (deviceId && !deviceDB) {
      sh.getRange(linha, COL_DEVICE_ID + 1).setValue(deviceId);
      deviceUpdated = true;
    }

    const sessionToken = Utilities.getUuid();
    const sessionExpira = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

    sh.getRange(linha, COL_SESSION_TOKEN + 1).setValue(sessionToken);
    sh.getRange(linha, COL_SESSION_EXP + 1).setValue(sessionExpira);

    return {
      status: "ok",
      id: row[0],
      email,
      deviceId: deviceId || deviceDB,
      sessionToken,
      sessionExpira,
      deviceUpdated
    };
  }

  return { status: "not_registered" };
}
