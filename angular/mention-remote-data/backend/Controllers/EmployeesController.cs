using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;

namespace EJ2APIServices.Controllers {
    [SuppressMessage("Design", "CA1515:Consider making types internal")]
    public class EmployeesController: Controller {
        // GET api/Employees
        [Route("api/Employees")]
        [HttpGet]
        public IActionResult Get()
            {
            var queryString = Request.Query;
            var data = Employees.GetAllRecords().ToList();
            if (queryString.Keys.Count!=0)
                {
                _=queryString.TryGetValue("$skip", out StringValues skipValues);
                _=queryString.TryGetValue("$top", out StringValues topValues);
                _=queryString.TryGetValue("$filter", out StringValues filterValues);

                var skip = TryParseInt(skipValues.FirstOrDefault()??string.Empty, 0);
                var top = TryParseInt(topValues.FirstOrDefault()??string.Empty, data.Count);

                var filterText = filterValues.FirstOrDefault();

                if (!string.IsNullOrWhiteSpace(filterText))
                {
                    var filtered = Parse(filterText);
                    var payload = new
                        {
                        result = filtered.Skip(Math.Max(skip, 0)).Take(Math.Max(top, 0)),
                        count = filtered.Count
                        };
                    return Ok(payload);
                }

                var unfilteredPayload = new
                    {
                    result = data.Skip(Math.Max(skip, 0)).Take(Math.Max(top, 0)),
                    count = data.Count
                    };
                return Ok(unfilteredPayload);
                }

            return Ok(data);
            }

        private static int TryParseInt(string value, int fallback)
            {
            if (int.TryParse(value, NumberStyles.Integer, CultureInfo.InvariantCulture, out var parsed))
                {
                return parsed;
                }
            return fallback;
            }

        private static List<Employees> Parse(string filterQuery)
            {
            var filterData = new List<Employees>();

            if (string.IsNullOrWhiteSpace(filterQuery))
                return filterData;

            var filterType = Regex.Match(filterQuery, @"(startswith|endswith|substringof)", RegexOptions.IgnoreCase);
            if (!filterType.Success)
                return filterData;

            var matchString1 = Regex.Match(filterQuery, @"tolower\(([^)]+)\)", RegexOptions.IgnoreCase);

            var matchString2 = Regex.Match(filterQuery, @"'([^']+)',\s*tolower", RegexOptions.IgnoreCase);

            string columnName;
            string queryString;

            if (Regex.IsMatch(filterType.Value, @"^(startswith|endswith)$", RegexOptions.IgnoreCase))
                {
                if (!matchString1.Success)
                    return filterData;

                columnName=matchString1.Groups[1].Value.Trim();

                var argMatch = Regex.Match(filterQuery, @"'(.*?)'", RegexOptions.IgnoreCase);
                if (!argMatch.Success)
                    return filterData;

                queryString=argMatch.Groups[1].Value;
                }
            else
                {
                if (!matchString1.Success||!matchString2.Success)
                    return filterData;

                columnName=matchString1.Groups[1].Value.Trim();
                queryString=matchString2.Groups[1].Value.Trim();
                }

            return Filtering(filterType.Value, columnName, queryString);
            }

        private static List<Employees> Filtering(string filterType, string columnName, string queryString)
            {
            var resultData = new List<Employees>();

            if (string.IsNullOrWhiteSpace(columnName)||string.IsNullOrWhiteSpace(queryString))
                return resultData;

            var allRecords = Employees.GetAllRecords();

            var property = typeof(Employees).GetProperty(
                columnName,
                BindingFlags.Public|BindingFlags.Instance|BindingFlags.IgnoreCase);

            if (property==null)
                return resultData;

            const StringComparison cmp = StringComparison.OrdinalIgnoreCase;

            foreach (var item in allRecords)
                {
                var raw = property.GetValue(item);
                if (raw is null)
                    continue;

                var value = raw as string??raw.ToString()??string.Empty;

                var include =
                    filterType.Equals("substringof", StringComparison.OrdinalIgnoreCase) ? value.Contains(queryString, cmp) :
                    filterType.Equals("startswith", StringComparison.OrdinalIgnoreCase) ? value.StartsWith(queryString, cmp) :
                    filterType.Equals("endswith", StringComparison.OrdinalIgnoreCase) ? value.EndsWith(queryString, cmp) :
                    false;

                if (include)
                    resultData.Add(item);
                }

            return resultData;
            }
        public string Get(int id) => "value";
        }

    [SuppressMessage("Design", "CA1515:Consider making types internal")]
    public class Employees {
        private static readonly List<Employees> Emp = new();

        public Employees()
            {
            }

        public Employees(int employeeId, string firstName, string designation, string country)
            {
            EmployeeID=employeeId;
            FirstName=firstName;
            Designation=designation;
            Country=country;
            }

        public static IReadOnlyList<Employees> GetAllRecords()
            {
            if (Emp.Count==0)
                {
                Emp.Add(new Employees { EmployeeID=1, FirstName="Andrew Fuller", Designation="Team Lead", Country="England" });
                Emp.Add(new Employees { EmployeeID=2, FirstName="Anne Dodsworth", Designation="Developer", Country="USA" });
                Emp.Add(new Employees { EmployeeID=3, FirstName="Janet Leverling", Designation="HR", Country="USA" });
                Emp.Add(new Employees { EmployeeID=4, FirstName="Laura Callahan", Designation="Product Manager", Country="USA" });
                Emp.Add(new Employees { EmployeeID=5, FirstName="Margaret Peacock", Designation="Developer", Country="USA" });
                Emp.Add(new Employees { EmployeeID=6, FirstName="Michael Suyama", Designation="Team Lead", Country="USA" });
                Emp.Add(new Employees { EmployeeID=7, FirstName="Nancy Davolio", Designation="Product Manager", Country="USA" });
                Emp.Add(new Employees { EmployeeID=8, FirstName="Robert King", Designation="Developer ", Country="England" });
                Emp.Add(new Employees { EmployeeID=9, FirstName="Steven Buchanan", Designation="CEO", Country="England" });

                var firstNames = new[] { "Liam", "Olivia", "Noah", "Emma", "Elijah", "Ava", "James", "Sophia", "William", "Isabella", "Benjamin", "Mia", "Lucas", "Charlotte", "Henry", "Amelia", "Alexander", "Evelyn", "Michael", "Harper" };
                var lastNames = new[] { "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee" };
                var designations = new[] { "Developer", "Team Lead", "Product Manager", "HR", "CEO", "Architect", "QA Engineer", "Scrum Master" };
                var countries = new[] { "USA", "England", "Germany", "India", "Canada", "Australia" };

                var usedNames = new HashSet<string>(StringComparer.Ordinal);
                var id = 10;

                foreach (var fName in firstNames)
                    {
                    foreach (var lName in lastNames)
                        {
                        if (id>500)
                            break;

                        var fullName = $"{fName} {lName}";
                        if (!usedNames.Add(fullName))
                            continue;

                        Emp.Add(new Employees {
                            EmployeeID=id,
                            FirstName=fullName,
                            Designation=designations[(id+fName.Length)%designations.Length],
                            Country=countries[(id+lName.Length)%countries.Length]
                            });

                        id++;
                        }
                    if (id>500)
                        break;
                    }
                }

            return Emp;
            }

        [Key]
        public int EmployeeID { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string Designation { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        }
    }