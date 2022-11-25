const companies = require("./data/company.json");
const facilities = require("./data/facilities.json");
const agents = require("./data/agents.json");
const shifts = require("./data/shifts.json");

function hoursDiff(startString, endString) {
  const start = new Date(startString).getTime();
  const end = new Date(endString).getTime();

  var diff = end.valueOf() - start.valueOf();
  return diff / 1000 / 60 / 60; // Convert milliseconds to hours
}

function getShiftsByFacility(facilityId) {
  var today = new Date();
  var quarter = Math.floor((today.getMonth() + 3) / 3);
  var nextq;
  if (quarter == 4) {
    nextq = new Date(today.getFullYear() + 1, 1, 1);
  } else {
    nextq = new Date(today.getFullYear(), quarter * 3, 1);
  }
  const data = shifts.filter(
    (v) =>
      v.facility === facilityId &&
      today > new Date(v.shift_start_time) &&
      new Date(v.shift_end_time) &&
      quarter
  );
  let totalHours = 0;
  data.forEach((v) => {
    const agentSpentHours = hoursDiff(v.agent_start_time, v.agent_end_time);
    const breakTime = hoursDiff(v.break_time_start_from, v.break_time_end_at);
    totalHours += agentSpentHours - breakTime;
  });

  return totalHours;
}

function generateReport(facilityId) {
  var today = new Date();
  var quarter = Math.floor((today.getMonth() + 3) / 3);
  var nextq;
  if (quarter == 4) {
    nextq = new Date(today.getFullYear() + 1, 1, 1);
  } else {
    nextq = new Date(today.getFullYear(), quarter * 3, 1);
  }
  const data = shifts.filter(
    (v) =>
      v.facility === facilityId &&
      today > new Date(v.shift_start_time) &&
      new Date(v.shift_end_time) &&
      quarter
  );

  const pdfData = data.map(
    ({
      _id,
      facility: facilityId,
      agent: agentId,
      company: companyId,
      shift_start_time,
      shift_end_time,
      agent_start_time,
      agent_end_time,
      break_time_start_from,
      break_time_end_at,
      description
    }) => {
      const agentSpentHours = hoursDiff(agent_start_time, agent_end_time);
      const facility = facilities.find(v => v._id === facilityId);
      const breakTime = hoursDiff(break_time_start_from, break_time_end_at);
      const agent = agents.find(v => v._id === agentId);
      const company = companies.find(v => v.id === companyId)
      return {
        shift_id: _id,
        facility: facility.name,
        agent: agent.name,
        company: company.name,
        shift_start_time: new Date(shift_start_time).toDateString(),
        shift_end_time: new Date(shift_end_time).toDateString(),
        agent_start_time: new Date(agent_start_time).toDateString(),
        agent_end_time: new Date(agent_end_time).toDateString(),
        agent_total_time: agentSpentHours,
        break_time_start_from: new Date(break_time_start_from).toDateString(),
        break_time_end_at: new Date(break_time_end_at).toDateString(),
        total_break_time: breakTime,
        description
      };
    }
  );
  return pdfData
}

console.log(getShiftsByFacility(20001));
console.log(generateReport(20001));
