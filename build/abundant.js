import { medians } from "./data.js"


export function plot_abundant(ele, sample) {
  const empty = sample === null || JSON.stringify(sample[0]) === "{}";
  const ranks = ["phylum", "class", "order", "family", "genus", "species"];

  ele.innerHTML = (
  `<table>
    <tbody>
      <tr>
        <th scope="col">Rank</th>
        <th scope="col">Most Abundant Taxon</th>
        <th scope="col">Relative Abundance</th>
        <th scope="col">Median (Healthy)</th>
        <th scope="col">Median (Nonhealthy)</th>
        <th scope="col">Median (All)</th>
      </tr>
        ${(ranks.map((rank, idx) => get_row(rank, sample, idx, empty))).join("")}
    </tbody>
  </table>`
  );

  let caption = `<br/><br/><b>Most Abundant Taxa.</b> The input sample's most abundant taxon at each taxonomic rank.`
  ele.innerHTML += caption;

}

function get_row(rank, sample, idx, empty) {
  if (empty) {
    return (`
        <th scope="row" style="black">${toTitleCase(rank)}</th>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        </tr>`
    );
  }

  // sort the taxonomic level by abundance
  const level = sample[idx];
  const level_sorted = Object.keys(level).map(ele => [ele, level[ele]])
  level_sorted.sort((a, b) => b[1] - a[1]);

  // Get the most abundant taxon
  const most_abundant = level_sorted[0];
  const name = most_abundant[0];
  const abundance = most_abundant[1];

  // Get the median
  const m_h = (medians[name]['h'] * 100).toFixed(3);
  const m_n = (medians[name]['n'] * 100).toFixed(3);
  const m_a = (medians[name]['a'] * 100).toFixed(3);

  return (
      `<tr>
        <th scope="row" style="black">${toTitleCase(rank)}</th>
        <td>${name.split(/\w__/)[1].replace("_", " ")}</td>
        <td>${(abundance * 100).toFixed(3) + "%"}</td>
        <td>${`${m_h}`}%</td>
        <td>${`${m_n}`}%</td>
        <td>${`${m_a}`}%</td>
      </tr>`
  );
}

// https://stackoverflow.com/a/196991/14772896
function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}