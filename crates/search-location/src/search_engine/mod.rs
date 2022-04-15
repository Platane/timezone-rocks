mod jaro_winkler_similarity;

use jaro_winkler_similarity::get_jaro_winkler_similarity;

pub struct SearchEngine {
    word_list: Vec<Vec<String>>,
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
            let score = q
                .iter()
                .zip(w.iter())
                .fold(0.0, |sum, (a, b)| sum + get_jaro_winkler_similarity(a, b));

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

fn normalize(w: &str) -> Vec<String> {
    let w = diacritics::remove_diacritics(w);

    let w = w.to_lowercase();

    w.split_ascii_whitespace().map(|w| w.to_string()).collect()
}

#[cfg(test)]
mod tests {

    use super::*;

    #[test]
    fn it_should_return_word_matching_pattern() {
        let word_list = vec![
            "orange".to_string(),
            "blue".to_string(),
            "moon".to_string(),
            "red".to_string(),
            "ronge".to_string(),
            "orange".to_string(),
            "carmin".to_string(),
        ];
        let se = SearchEngine::create(word_list);

        let results = se.search("ornge", 3);
        let expected = vec![0, 5, 4];

        assert_eq!(&expected[..], &results[..]);
    }
}
