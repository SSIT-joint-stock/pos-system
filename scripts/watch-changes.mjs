// scripts/watch-changes.mjs
import chokidar from 'chokidar';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = process.cwd();
const ONLY_APP = path.join('apps', 'web', 'main'); // vùng bạn muốn ưu tiên
const LOG_FILE = path.join(ROOT, 'change-debug.log');

// patterns cần bỏ qua (mở rộng tùy repo)
const IGNORE = [
    'change-debug.log',
    '**/node_modules/**',
    '**/.git/**',
    '**/.next/**',
    '**/.turbo/**',
    '**/dist/**',
    '**/build/**',
];

// Debounce để gộp burst sự kiện
const DEBOUNCE_MS = 120;

// Tính hash nhanh (để phân biệt real-content change vs touch/metadata)
function fastHash(filePath) {
    try {
        const buf = fs.readFileSync(filePath);
        return crypto.createHash('sha1').update(buf).digest('hex').slice(0, 10);
    } catch {
        return '—';
    }
}

function ts() {
    return new Date().toISOString().replace('T', ' ').replace('Z', '');
}

function log(line) {
    fs.appendFileSync(LOG_FILE, line + '\n');
    console.log(line);
}

// Lọc chỉ app hoặc ưu tiên app (không bắt buộc)
function isInApp(p) {
    const norm = p.replaceAll('\\', '/');
    return norm.includes(ONLY_APP.replaceAll('\\', '/'));
}

// Gộp các event trong khoảng ngắn
let queue = [];
let timer = null;

function enqueue(evt, filePath) {
    queue.push([evt, filePath]);
    if (timer) clearTimeout(timer);
    timer = setTimeout(flush, DEBOUNCE_MS);
}

function flush() {
    const batch = queue;
    queue = [];
    timer = null;

    // Gom theo file
    const grouped = new Map();
    for (const [evt, fp] of batch) {
        const k = fp;
        grouped.set(k, (grouped.get(k) || new Set()).add(evt));
    }

    // In log
    for (const [fp, evts] of grouped.entries()) {
        const rel = path.relative(ROOT, fp) || fp;
        let size = '—', hash = '—';
        try {
            const stat = fs.statSync(fp);
            if (stat.isFile()) {
                size = stat.size + 'B';
                hash = fastHash(fp);
            }
        } catch { }
        const line = `[${ts()}] ${[...evts].join('+').padEnd(12)} | ${rel} | size=${size} | hash=${hash}`;
        log(line);
    }
}

async function main() {
    // Xóa log cũ
    try { fs.unlinkSync(LOG_FILE); } catch { }

    log(`=== watch start @ ${ts()} (root=${ROOT}) ===`);
    log(`ignore: ${IGNORE.join(', ')}`);
    log(`only-app-hint: ${ONLY_APP}`);

    const watcher = chokidar.watch(['.'], {
        ignored: IGNORE,
        ignoreInitial: true,
        persistent: true,
        // các option giúp giảm "nhiễu" khi editor dùng atomic writes:
        awaitWriteFinish: { stabilityThreshold: 150, pollInterval: 50 },
        atomic: 200, // hợp nhất unlink/add thành change nếu xảy ra rất nhanh
        depth: 99,
    });

    watcher
        .on('add', (p) => enqueue('add', path.resolve(p)))
        .on('change', (p) => enqueue('change', path.resolve(p)))
        .on('unlink', (p) => enqueue('unlink', path.resolve(p)))
        .on('addDir', (p) => enqueue('addDir', path.resolve(p)))
        .on('unlinkDir', (p) => enqueue('unlinkDir', path.resolve(p)))
        .on('error', (err) => log(`[${ts()}] ERROR ${err?.stack || err}`));

    // Gợi ý: log riêng các thay đổi ngoài apps/web/main để xem Turbo/.turbo có chọc vào:
    watcher.on('all', (evt, p) => {
        const abs = path.resolve(p);
        if (!isInApp(abs)) {
            enqueue(`OUTSIDE(${evt})`, abs);
        }
    });
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
