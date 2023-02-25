# nestjs-typeorm-aurora-mysql

aws Aurora mysql 向けの[TypeOrm](https://typeorm.io/)実装サンプル

## Motivation

connection Pooling による aws Aurora で発生する以下の問題に改善

1. aws Aurora を使用する際の failover 時に Writer インスタンスが、Reader に降格した際に Connection Pool を使用していると Reader インスタンスに書き込みをしに行きエラーになる事象の改善。
2. 複数の Reader を運用している際に Reader Endpoint の負荷分散が均一に分散しない問題の改善
3. Reader を追加した際に追加した Reader インスタンスに即座に接続しない問題の改善
