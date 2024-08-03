const fs = require('fs');
const path = require('path');

const directoryPath = 'src';
const translationFilePath = './translation.json';
let translations = {};

function traverseDirectory(dir) {
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.lstatSync(filePath).isDirectory()) {
            traverseDirectory(filePath);
        } else if (filePath.endsWith('.svelte')) {
            parseSvelteFile(filePath);
        }
    });
}

function parseSvelteFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    const regex = />([^<{}]+)</g;
    let match;
    while ((match = regex.exec(content)) !== null) {
        const staticText = match[1].trim();
        if (staticText) {
            const translationKey = staticText.replace(/\s+/g, '_').toLowerCase();
            translations[translationKey] = staticText;
            content = content.replace(staticText, `{$t("${translationKey}")}`);
        }
    }
    fs.writeFileSync(filePath, content, 'utf-8');
}

function saveTranslations() {
    fs.writeFileSync(translationFilePath, JSON.stringify(translations, null, 2), 'utf-8');
}

traverseDirectory(directoryPath);
saveTranslations();