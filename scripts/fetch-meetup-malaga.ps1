<#
.SYNOPSIS
  Fetches upcoming Meetup events around Málaga and writes them to data/meetup-malaga.json and data/meetup-malaga.ics.
.EXAMPLE
  ./scripts/fetch-meetup-malaga.ps1 -Days 45
#>
param(
    [int]$Days = 35,
    [double]$Lat = 36.72,
    [double]$Lon = -4.42,
    [int]$RadiusMiles = 16,
    [string]$OutDir = (Join-Path $PSScriptRoot '..\data')
)

$ErrorActionPreference = 'Stop'
$start = (Get-Date).Date
$end = $start.AddDays($Days)
$fmt = 'yyyy-MM-ddTHH:mm:ss'

$query = @'
query($filter: RecommendedEventsFilter!, $after: String) {
  recommendedEvents(filter: $filter, sort: { sortField: DATETIME }, first: 100, after: $after) {
    pageInfo { hasNextPage endCursor }
    edges { node {
      id title dateTime endTime eventType eventUrl
      group { name urlname }
      venue { name address city }
    } }
  }
}
'@

$filter = @{
    lat                 = $Lat
    lon                 = $Lon
    radius              = $RadiusMiles
    startDateRange      = "$($start.ToString($fmt))+01:00[Europe/Madrid]"
    endDateRange        = "$($end.ToString($fmt))+01:00[Europe/Madrid]"
    doConsolidateEvents = $false
}

$events = @()
$after = $null
do {
    $body = @{ query = $query; variables = @{ filter = $filter; after = $after } } | ConvertTo-Json -Depth 6
    $resp = Invoke-WebRequest -UseBasicParsing -Method Post -Uri 'https://www.meetup.com/gql2' `
        -ContentType 'application/json' -Body ([Text.Encoding]::UTF8.GetBytes($body)) `
        -Headers @{ 'User-Agent' = 'Mozilla/5.0 (event-calendar)' }
    $json = [Text.Encoding]::UTF8.GetString($resp.RawContentStream.ToArray()) | ConvertFrom-Json
    if ($json.errors) { throw ($json.errors | ConvertTo-Json -Depth 5) }
    $page = $json.data.recommendedEvents
    $events += $page.edges | ForEach-Object { $_.node }
    $after = $page.pageInfo.endCursor
} while ($page.pageInfo.hasNextPage)

$events = $events | Sort-Object id -Unique | Sort-Object dateTime, title | ForEach-Object {
    [ordered]@{
        id      = $_.id
        title   = $_.title.Trim()
        start   = $_.dateTime
        end     = $_.endTime
        type    = $_.eventType
        url     = $_.eventUrl
        group   = $_.group.name
        venue   = $_.venue.name
        address = $_.venue.address
        city    = $_.venue.city
    }
}

New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$utf8 = New-Object System.Text.UTF8Encoding($false)

$jsonOut = [ordered]@{
    source    = 'meetup.com'
    location  = 'Málaga, ES'
    fetchedAt = (Get-Date).ToString('yyyy-MM-ddTHH:mm:sszzz')
    count     = @($events).Count
    events    = @($events)
} | ConvertTo-Json -Depth 5
[IO.File]::WriteAllText((Join-Path $OutDir 'meetup-malaga.json'), $jsonOut + "`n", $utf8)

function Format-IcsDate([string]$iso) {
    ([DateTimeOffset]::Parse($iso)).UtcDateTime.ToString("yyyyMMdd'T'HHmmss'Z'")
}
function Format-IcsText([string]$s) {
    if (-not $s) { return '' }
    $s -replace '\\', '\\' -replace ';', '\;' -replace ',', '\,' -replace "`r?`n", '\n'
}

$stamp = (Get-Date).ToUniversalTime().ToString("yyyyMMdd'T'HHmmss'Z'")
$lines = @('BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//alexcerezo//event-calendar//ES', 'CALSCALE:GREGORIAN', 'X-WR-CALNAME:Meetup Málaga')
foreach ($e in $events) {
    $location = (@($e.venue, $e.address, $e.city) | Where-Object { $_ }) -join ', '
    $lines += 'BEGIN:VEVENT'
    $lines += "UID:meetup-$($e.id)@event-calendar"
    $lines += "DTSTAMP:$stamp"
    $lines += "DTSTART:$(Format-IcsDate $e.start)"
    if ($e.end) { $lines += "DTEND:$(Format-IcsDate $e.end)" }
    $lines += "SUMMARY:$(Format-IcsText $e.title)"
    $lines += "DESCRIPTION:$(Format-IcsText "$($e.group)`n$($e.url)")"
    if ($location) { $lines += "LOCATION:$(Format-IcsText $location)" }
    $lines += "URL:$($e.url)"
    $lines += 'END:VEVENT'
}
$lines += 'END:VCALENDAR'
[IO.File]::WriteAllText((Join-Path $OutDir 'meetup-malaga.ics'), ($lines -join "`r`n") + "`r`n", $utf8)

Write-Host "Saved $(@($events).Count) events to $OutDir"
