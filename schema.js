module.exports = `
    CREATE TABLE IF NOT EXISTS daily_bhav (
        SYMBOL          TEXT,
        SERIES          TEXT,
        DATE            INTEGER,
        FMT_DATE        TEXT,
        PREV_CLOSE      REAL, 
        OPEN_PRICE      REAL, 
        HIGH_PRICE      REAL, 
        LOW_PRICE       REAL, 
        LAST_PRICE      REAL, 
        CLOSE_PRICE     REAL,
        AVG_PRICE       REAL, 
        TTL_TRD_QNTY    REAL, 
        TURNOVER_LACS   REAL, 
        NO_OF_TRADES    REAL, 
        DELIV_QTY       REAL, 
        DELIV_PER       REAL,
        FILENAME        TEXT
    )
`