const readline = require('readline-sync');
const utils = require('./src/utils');

const gradesIndexes = {
  '3 EM SP': '214',
  '2 EM SP': '212',
  '1 EM SP': '213',
  '9 EF SP': '208',
  '8 EF SP': '210',
  '7 EF SP': '202',
  '6 EF SP': '203',
  '5 EF SP': '201',
  '4 EF SP': '218',
  '3 EF SP': '205',
  '2 EF SP': '209',
  '1 EF SP': '217'
};

const credentials = {
  "ra": readline.question('ra (exp:000111611021'),
  "digit": readline.question('0'),
  "uf": readline.question('sp'),
  "password": readline.question('senha exp: password123
			')
};

;(async () => {
  try {
    if (!credentials.ra || !credentials.digit || !credentials.uf || !credentials.password) {
      console.error('Credenciais inválidas');
      return;
    }

    console.log('Credentials:', credentials);
    const tokensResponse = await utils.getTokens(credentials);
    console.log('Tokens response:', tokensResponse);

    if (!tokensResponse || !tokensResponse.xApiKey || !tokensResponse.grade || !tokensResponse.rooms || !tokensResponse.statusCode) {
      console.error('Resposta de tokens inválida');
      return;
    }

    const { xApiKey, grade, rooms, statusCode } = tokensResponse;

    if (statusCode != 200) {
      console.log('\x1b[31m', 'Erro: Usuário não encontrado, verifique suas credenciais e tente novamente.', '\x1b[0m');
      return;
    }

    var taskList = await utils.getTasks(xApiKey, rooms, gradesIndexes[grade]);

    if (taskList.length <= 0) {
      console.log('\x1b[31m', 'Não encontrei nenhuma tarefa :/', '\x1b[0m');
      return;
    }

    console.log('\x1b[31m', `${taskList.length} tarefa(s) encontradas.`, '\x1b[0m');

    for (let task of taskList) {
      await utils.answerTask(task.id, xApiKey, rooms[0].name);
      console.log(task.title.trim(), '-', '\x1b[32m', 'Concluída ✔️', '\x1b[0m');
      utils.sleep(1000);
    }
  } catch (error) {
    console.error('Erro ao obter tokens:', error);
  }
})();
