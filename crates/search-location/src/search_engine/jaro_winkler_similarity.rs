use core::cmp::{max, min};

pub fn is_prefix(prefix: &str, word: &str) -> bool {
    prefix.len() <= word.len()
        && prefix
            .chars()
            .zip(word.chars())
            .all(|(c_a, c_b)| c_a == c_b)
}

const P: f32 = 0.1;
const L_MAX: usize = 4;

pub fn get_jaro_winkler_similarity(a: &str, b: &str) -> f32 {
    let l_a = a.len();
    let l_b = b.len();

    let max_distance = max(max(l_a, l_b) / 2, 1) - 1;

    let mut matched_a = vec![false; l_a];
    let mut matched_b = vec![false; l_b];

    let mut matching_count = 0;

    for i_a in 0..l_a {
        let c_a = a.chars().nth(i_a as usize).unwrap();

        for i_b in (i_a - min(max_distance, i_a))..(min(l_b - 1, i_a + max_distance) + 1) {
            let c_b = b.chars().nth(i_b as usize).unwrap();

            // println!(" {}({}) ===  {}({})", c_a, i_a, c_b, i_b);

            if c_a == c_b && !matched_b[i_b] && !matched_a[i_a] {
                // println!("match");

                matched_b[i_b] = true;
                matched_a[i_a] = true;
                matching_count = matching_count + 1;
            }
        }
    }

    let mut transition_count = 0;

    let mut i_a = 0;
    let mut i_b = 0;

    for _ in 0..matching_count {
        while !matched_a[i_a] {
            i_a = i_a + 1;
        }
        while !matched_b[i_b] {
            i_b = i_b + 1;
        }

        if a.chars().nth(i_a).unwrap() != b.chars().nth(i_b).unwrap() {
            transition_count = transition_count + 1;
        }

        i_a = i_a + 1;
        i_b = i_b + 1;
    }

    if matching_count == 0 {
        return 0.0;
    }

    let matching_count = matching_count as f32;
    let transition_count = (transition_count as f32) / 2.0;

    let jaro_sim = ((matching_count / l_a as f32)
        + (matching_count / l_b as f32)
        + ((matching_count - transition_count) / matching_count))
        / 3.0;

    let mut l = 0;

    while l < L_MAX && l < l_a && l < l_b && a.chars().nth(l).unwrap() == b.chars().nth(l).unwrap()
    {
        l = l + 1;
    }

    let p = 0.1;

    return jaro_sim + (l as f32) * P * (1.0 - jaro_sim);
}

#[cfg(test)]
mod tests {

    use super::*;

    #[test]
    fn similarity_should_compare_string() {
        assert_eq!(
            get_jaro_winkler_similarity("hello", "hello"),
            1.0,
            "equal string should have a sim of 1"
        );

        assert_eq!(get_jaro_winkler_similarity("martha", "marhta"), 0.96111107);
    }
}
