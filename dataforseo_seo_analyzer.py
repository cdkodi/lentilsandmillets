import requests
import json
import base64
import pandas as pd
from typing import List, Dict, Any, Optional
import time


class DataForSEOAnalyzer:
    def __init__(self, username: str, password: str):
        """
        Initialize DataForSEO API client
        
        Args:
            username: DataForSEO API username
            password: DataForSEO API password
        """
        self.username = username
        self.password = password
        self.base_url = "https://api.dataforseo.com"
        self.headers = {
            'Authorization': f'Basic {self._encode_credentials()}',
            'Content-Type': 'application/json'
        }
    
    def _encode_credentials(self) -> str:
        """Encode API credentials for Basic Auth"""
        credentials = f"{self.username}:{self.password}"
        return base64.b64encode(credentials.encode()).decode()
    
    def keyword_research(self, keywords: List[str], location_code: int = 2840, 
                        language_code: str = "en") -> Dict[str, Any]:
        """
        Perform keyword research using Keywords Data API
        
        Args:
            keywords: List of keywords to research
            location_code: Location code (default: 2840 for United States)
            language_code: Language code (default: "en" for English)
        """
        endpoint = f"{self.base_url}/v3/keywords_data/google_ads/search_volume/live"
        
        payload = [{
            "keywords": keywords,
            "location_code": location_code,
            "language_code": language_code
        }]
        
        response = requests.post(endpoint, json=payload, headers=self.headers)
        
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"API request failed: {response.status_code} - {response.text}")
    
    def get_keyword_suggestions(self, seed_keyword: str, location_code: int = 2840,
                               language_code: str = "en", limit: int = 100) -> Dict[str, Any]:
        """
        Get keyword suggestions using Keywords Data API
        
        Args:
            seed_keyword: Seed keyword for suggestions
            location_code: Location code
            language_code: Language code
            limit: Maximum number of suggestions
        """
        endpoint = f"{self.base_url}/v3/keywords_data/google_ads/keywords_for_keywords/live"
        
        payload = [{
            "keywords": [seed_keyword],
            "location_code": location_code,
            "language_code": language_code,
            "limit": limit
        }]
        
        response = requests.post(endpoint, json=payload, headers=self.headers)
        
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"API request failed: {response.status_code} - {response.text}")
    
    def competitor_keywords(self, domain: str, location_code: int = 2840,
                           language_code: str = "en", limit: int = 100) -> Dict[str, Any]:
        """
        Get competitor keywords using DataForSEO Labs API
        
        Args:
            domain: Competitor domain to analyze
            location_code: Location code
            language_code: Language code
            limit: Maximum number of keywords
        """
        endpoint = f"{self.base_url}/v3/dataforseo_labs/google/keywords_for_site/live"
        
        payload = [{
            "target": domain,
            "location_code": location_code,
            "language_code": language_code,
            "limit": limit
        }]
        
        response = requests.post(endpoint, json=payload, headers=self.headers)
        
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"API request failed: {response.status_code} - {response.text}")
    
    def competitor_analysis(self, domains: List[str], location_code: int = 2840,
                           language_code: str = "en") -> Dict[str, Any]:
        """
        Analyze multiple competitor domains
        
        Args:
            domains: List of competitor domains
            location_code: Location code
            language_code: Language code
        """
        results = {}
        
        for domain in domains:
            print(f"Analyzing competitor: {domain}")
            try:
                competitor_data = self.competitor_keywords(
                    domain=domain,
                    location_code=location_code,
                    language_code=language_code
                )
                results[domain] = competitor_data
                time.sleep(1)  # Rate limiting
            except Exception as e:
                print(f"Error analyzing {domain}: {str(e)}")
                results[domain] = {"error": str(e)}
        
        return results
    
    def keyword_difficulty(self, keywords: List[str], location_code: int = 2840,
                          language_code: str = "en") -> Dict[str, Any]:
        """
        Get keyword difficulty scores using DataForSEO Labs API
        
        Args:
            keywords: List of keywords to analyze
            location_code: Location code
            language_code: Language code
        """
        endpoint = f"{self.base_url}/v3/dataforseo_labs/google/keyword_suggestions/live"
        
        payload = [{
            "keywords": keywords,
            "location_code": location_code,
            "language_code": language_code,
            "include_serp_info": True
        }]
        
        response = requests.post(endpoint, json=payload, headers=self.headers)
        
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"API request failed: {response.status_code} - {response.text}")
    
    def format_keyword_data(self, api_response: Dict[str, Any]) -> pd.DataFrame:
        """
        Format keyword research results into a pandas DataFrame
        
        Args:
            api_response: Raw API response
        """
        if not api_response.get('tasks') or not api_response['tasks'][0].get('result'):
            return pd.DataFrame()
        
        results = api_response['tasks'][0]['result']
        
        formatted_data = []
        for item in results:
            formatted_data.append({
                'keyword': item.get('keyword', ''),
                'search_volume': item.get('search_volume', 0),
                'competition': item.get('competition', 0),
                'competition_level': item.get('competition_level', ''),
                'cpc': item.get('cpc', 0),
                'monthly_searches': item.get('monthly_searches', [])
            })
        
        return pd.DataFrame(formatted_data)
    
    def format_competitor_data(self, api_response: Dict[str, Any]) -> pd.DataFrame:
        """
        Format competitor analysis results into a pandas DataFrame
        
        Args:
            api_response: Raw API response
        """
        if not api_response.get('tasks') or not api_response['tasks'][0].get('result'):
            return pd.DataFrame()
        
        results = api_response['tasks'][0]['result']
        
        formatted_data = []
        for item in results:
            formatted_data.append({
                'keyword': item.get('keyword', ''),
                'search_volume': item.get('search_volume', 0),
                'competition': item.get('competition', 0),
                'cpc': item.get('cpc', 0),
                'serp_info': item.get('serp_info', {}),
                'rank_group': item.get('rank_group', 0),
                'rank_absolute': item.get('rank_absolute', 0),
                'position': item.get('position', 0),
                'xpath': item.get('xpath', ''),
                'domain': item.get('domain', ''),
                'title': item.get('title', ''),
                'url': item.get('url', ''),
                'is_featured_snippet': item.get('is_featured_snippet', False),
                'is_malicious': item.get('is_malicious', False),
                'is_web_story': item.get('is_web_story', False),
                'description': item.get('description', ''),
                'pre_snippet': item.get('pre_snippet', ''),
                'extended_snippet': item.get('extended_snippet', '')
            })
        
        return pd.DataFrame(formatted_data)
    
    def export_to_csv(self, data: pd.DataFrame, filename: str):
        """Export DataFrame to CSV file"""
        data.to_csv(filename, index=False)
        print(f"Data exported to {filename}")
    
    def export_to_excel(self, data_dict: Dict[str, pd.DataFrame], filename: str):
        """Export multiple DataFrames to Excel file with separate sheets"""
        with pd.ExcelWriter(filename, engine='openpyxl') as writer:
            for sheet_name, df in data_dict.items():
                df.to_excel(writer, sheet_name=sheet_name, index=False)
        print(f"Data exported to {filename}")
    
    def export_to_excel(self, data_dict: Dict[str, pd.DataFrame], filename: str):
        """Export multiple DataFrames to Excel file with separate sheets"""
        with pd.ExcelWriter(filename, engine='openpyxl') as writer:
            for sheet_name, df in data_dict.items():
                df.to_excel(writer, sheet_name=sheet_name, index=False)
        print(f"Data exported to {filename}")


def main():
    """
    Example usage of the DataForSEO analyzer
    """
    # Initialize the analyzer with your credentials
    analyzer = DataForSEOAnalyzer(
        username="cdkodi@gigtime.pro",
        password="a465b59a55f58c1d"
    )
    
    # Example keywords for research
    keywords = ["lentils", "millets", "healthy grains", "protein rich foods"]
    
    # Example competitor domains
    competitors = ["example1.com", "example2.com"]
    
    try:
        # Perform keyword research
        print("Performing keyword research...")
        keyword_data = analyzer.keyword_research(keywords)
        keyword_df = analyzer.format_keyword_data(keyword_data)
        
        # Get keyword suggestions
        print("Getting keyword suggestions...")
        suggestions = analyzer.get_keyword_suggestions("lentils")
        suggestions_df = analyzer.format_keyword_data(suggestions)
        
        # Analyze competitors
        print("Analyzing competitors...")
        competitor_data = analyzer.competitor_analysis(competitors)
        
        # Export results
        export_data = {
            "Keywords": keyword_df,
            "Suggestions": suggestions_df
        }
        
        # Add competitor data to export
        for domain, data in competitor_data.items():
            if "error" not in data:
                competitor_df = analyzer.format_competitor_data(data)
                export_data[f"Competitor_{domain}"] = competitor_df
        
        analyzer.export_to_excel(export_data, "seo_analysis_results.xlsx")
        
        print("Analysis complete! Results saved to seo_analysis_results.xlsx")
        
    except Exception as e:
        print(f"Error during analysis: {str(e)}")
        
    except Exception as e:
        print(f"Error during analysis: {str(e)}")


if __name__ == "__main__":
    main()