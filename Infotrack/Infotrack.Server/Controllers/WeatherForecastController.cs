using HtmlAgilityPack;
using Microsoft.AspNetCore.Mvc;

namespace Infotrack.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class SolicitorsController : ControllerBase
    {
        private readonly ILogger<SolicitorsController> _logger;

        public SolicitorsController(ILogger<SolicitorsController> logger)
        {
            _logger = logger;
        }

        [HttpGet("GetSolicitors")]
        public async Task<IEnumerable<Solicitors>> GetSolicitors([FromQuery] string[] locations)
        {
            Solicitors[] solicitors = [];

            foreach (string location in locations)
            {
                await ScrapeWebsite($"https://www.solicitors.com/conveyancing+{location.Trim().ToLower()}.html", solicitors);
            }

            return solicitors;
        }

        public async Task ScrapeWebsite(string url, Solicitors[] solicitors)
        {
            using var httpClient = new HttpClient();
            // Many sites return an empty shell, challenge page, or tiny payload to default .NET / bot-like clients.
            httpClient.DefaultRequestHeaders.UserAgent.ParseAdd(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
            httpClient.DefaultRequestHeaders.Accept.ParseAdd("text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
            httpClient.DefaultRequestHeaders.AcceptLanguage.ParseAdd("en-GB,en;q=0.9");

            var html = await httpClient.GetStringAsync(url);

            var htmlDocument = new HtmlDocument();
            htmlDocument.LoadHtml(html);

            var resultItems = htmlDocument.DocumentNode.SelectNodes(
                "//div[contains(concat(' ', normalize-space(@class), ' '), ' result-item ')]");

            if (resultItems == null)
            {
                return;
            }

            foreach (var node in resultItems)
            {
                var name = ExtractFirmName(node);
                var address = node.SelectSingleNode(".//a[contains(concat(' ', normalize-space(@class), ' '), ' link-map ')]//address")
                    ?.InnerText.Trim();
                var telNode = node.SelectSingleNode(".//a[contains(concat(' ', normalize-space(@class), ' '), ' tel ')]");
                var telephone = telNode?.InnerText.Trim()
                    ?? telNode?.GetAttributeValue("href", null)?.Replace("tel:", "", StringComparison.OrdinalIgnoreCase).Trim();
                var description = node.SelectSingleNode(".//p")?.InnerText.Trim();

                _logger.LogInformation(
                    "Solicitor: {Name} | {Address} | {Telephone} | {Description}",
                    name, address, telephone, description);
            }
        }

        // First direct text under span.h2 is the firm name; InnerText would include star ratings.
        private static string? ExtractFirmName(HtmlNode item)
        {
            var h2Span = item.SelectSingleNode(".//span[normalize-space(@class)='h2']")
                ?? item.SelectSingleNode(".//span[contains(concat(' ', normalize-space(@class), ' '), ' h2 ')]");
            if (h2Span == null)
            {
                return null;
            }

            foreach (var child in h2Span.ChildNodes)
            {
                if (child.NodeType == HtmlNodeType.Text)
                {
                    var text = HtmlEntity.DeEntitize(child.InnerHtml).Trim();
                    if (text.Length > 0)
                    {
                        return text;
                    }
                }
            }

            return HtmlEntity.DeEntitize(h2Span.InnerText).Trim();
        }
    }
}
