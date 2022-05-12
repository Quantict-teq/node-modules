/**
 * Strip out script `src` values from <script> tags in a given HTML template.
 * Returns two lists of scripts, split based on whether they are `type="module"`.
 */
export function stripScriptsFromTemplate(template) {
    var _a;
    const bootstrapScripts = [];
    const bootstrapModules = [];
    const scripts = template.matchAll(/<script\n*?.+?src="(?<script>([^"]+?))"\n*.*?><\/script>/g);
    for (const match of scripts) {
        const scriptName = (_a = match.groups) === null || _a === void 0 ? void 0 : _a.script;
        if (!scriptName)
            continue;
        if (match[0].includes(`type="module"`)) {
            bootstrapModules.push(scriptName);
        }
        else {
            bootstrapScripts.push(scriptName);
        }
        template = template.replace(match[0], '');
    }
    return { noScriptTemplate: template, bootstrapScripts, bootstrapModules };
}
