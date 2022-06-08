mod jaro_winkler_similarity;

use jaro_winkler_similarity::get_jaro_winkler_similarity;

pub struct SearchEngine {
    word_list: Vec<Vec<u8>>,
}

impl SearchEngine {
    pub fn create(word_list: Vec<String>) -> SearchEngine {
        let word_list: Vec<_> = word_list.iter().map(|w| normalize(w)).collect();

        SearchEngine { word_list }
    }
    pub fn search(&self, pattern: &str, n: usize) -> Vec<usize> {
        let q = normalize(pattern);

        let mut results: Vec<(usize, f32)> = vec![];

        for (i, w) in self.word_list.iter().enumerate() {
            let score = get_jaro_winkler_similarity(w, &q);

            if results.len() < n || score > results.last().unwrap().1 {
                if results.len() == n {
                    results.pop();
                }
                let mut pos = 0;

                while match results.get(pos) {
                    Some((_, s)) => *s >= score,
                    None => false,
                } {
                    pos = pos + 1;
                }
                results.insert(pos, (i, score));
            }
        }

        results.iter().map(|(i, _)| *i).collect()
    }
}

fn normalize(string: &str) -> Vec<u8> {
    let mut arr: Vec<u8> = vec![];

    for c in string.chars() {
        match c {
            'A' | 'À' | 'Á' | 'Â' | 'Ã' | 'Ä' | 'Å' | 'Æ' | 'a' | 'à' | 'á' | 'â' | 'ã' | 'ä'
            | 'å' | 'æ' => arr.push(1),
            'B' | 'Þ' | 'b' | 'þ' => arr.push(2),
            'C' | 'Ç' | 'Č' | 'c' | 'ç' | 'č' => arr.push(3),
            'D' | 'Ď' | 'Ð' | 'd' | 'ď' | 'ð' => arr.push(4),
            'E' | 'Ě' | 'È' | 'É' | 'Ê' | 'Ë' | 'e' | 'ě' | 'è' | 'é' | 'ê' | 'ë' => {
                arr.push(5)
            }
            'F' | 'Ƒ' | 'f' | 'ƒ' => arr.push(6),
            'G' | 'g' => arr.push(7),
            'H' | 'h' => arr.push(8),
            'Ì' | 'Í' | 'Î' | 'Ï' | 'i' | 'ì' | 'í' | 'î' | 'ï' => arr.push(9),
            'J' | 'j' => arr.push(10),
            'K' | 'k' => arr.push(11),
            'L' | 'l' => arr.push(12),
            'M' | 'm' => arr.push(13),
            'Ň' | 'Ñ' | 'n' | 'ñ' | 'ň' => arr.push(14),
            'Ò' | 'Ó' | 'Ô' | 'Õ' | 'Ö' | 'Ø' | 'o' | 'ò' | 'ó' | 'ô' | 'õ' | 'ö' | 'ø' => {
                arr.push(15)
            }
            'P' | 'p' => arr.push(16),
            'Q' | 'q' => arr.push(17),
            'R' | 'Ř' | 'r' | 'ř' => arr.push(18),
            'S' | 'Š' | 's' | 'š' => arr.push(19),
            'ß' => {
                arr.push(19);
                arr.push(19)
            }
            'T' | 'Ť' | 't' | 'ť' => arr.push(20),
            'U' | 'Ů' | 'Ù' | 'Ú' | 'Û' | 'Ü' | 'u' | 'ů' | 'ù' | 'ú' | 'û' | 'ü' => {
                arr.push(21)
            }
            'V' | 'v' => arr.push(22),
            'W' | 'w' => arr.push(23),
            'X' | 'x' => arr.push(24),
            'Y' | 'Ý' | 'y' | 'ý' | 'ÿ' => arr.push(25),
            'Z' | 'Ž' | 'z' | 'ž' => arr.push(26),
            _ => arr.push(0),
        };
    }
    return arr;
}
