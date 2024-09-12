/* eslint-disable no-console */
import { copy, emptydir, ensureDir, move, remove } from 'fs-extra';
import { glob } from 'glob';
import { promises as fs } from 'fs';

const typeConvertor = async () => {
  console.log('START');
  const sourceDir = 'node_modules/@kubernetes/client-node/dist/gen/model/';
  const typesFile = 'node_modules/@kubernetes/client-node/dist/types.d.ts';
  const targetBaseDir = 'src/common/types/generated/';
  const targetLibDir = `${targetBaseDir}kube/`;
  const targetTypesFile = `${targetLibDir}types.dto.ts`;
  const targetLibEmbedDir = `${targetLibDir}models/types/`;
  const excludeFiles = ['models.dto.ts'];

  await emptydir(targetLibDir);
  await ensureDir(`${targetBaseDir}kube`);
  await copy(typesFile, targetTypesFile);
  await copy(sourceDir, targetLibEmbedDir);

  const jsFiles = await glob(`${targetLibEmbedDir}*.js`);
  for (const jsFile of jsFiles) {
    await remove(jsFile);
  }

  const tsFiles = await glob(`${targetLibEmbedDir}*.ts`);
  for (const tsFile of [targetTypesFile, ...tsFiles]) {
    const fileNameWithoutExt = tsFile.split('.')[0];
    const resultFileNameWithExt = `${fileNameWithoutExt}.dto.ts`;
    const fileNameWithoutPath = resultFileNameWithExt.split('/').slice(-1)[0];
    console.log(
      'resultFileNameWithExt',
      resultFileNameWithExt,
      fileNameWithoutPath,
    );

    if (resultFileNameWithExt !== targetTypesFile) {
      await move(tsFile, resultFileNameWithExt);
    }

    let currentFileContent = await fs.readFile(resultFileNameWithExt, 'utf8');
    if (fileNameWithoutPath === 'types.dto.ts') {
      currentFileContent = currentFileContent
        .replace(/import((.*)*);/g, '')
        .replace(/export interface.*(?=export type)/gs, '');
    } else if (!excludeFiles.includes(fileNameWithoutPath)) {
      currentFileContent = currentFileContent
        .replace(/ {4}static((.*|\n)*);/g, '')
        .replace(/export declare/g, 'export')
        .replace(/(from '.*(?='))/g, '$1.dto')
        .replace(/\[key: string]: string;/g, '')
        .replace(/\{\s*}/g, 'object');
    } else {
      currentFileContent = currentFileContent.replace(
        /(\* from '.*(?='))/g,
        '$1.dto',
      );
    }

    await fs.writeFile(resultFileNameWithExt, currentFileContent, 'utf8');
  }
};

typeConvertor()
  .then(() => console.log('END'))
  .catch((error) => console.log(error));
