package test.ticket.level1;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

import com.x.processplatform.core.entity.ticket.Ticket;
import com.x.processplatform.core.entity.ticket.Tickets;

@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class ParallelAddAfterQueueTest {

	@DisplayName("B后加签EFG,FEG串行处理,混合处理")
	@Test
	@Order(1)
	void test01() {
		List<Ticket> p1 = Arrays.asList(new Ticket("A", "LA"), new Ticket("B", "LB"), new Ticket("C", "LC"));
		List<Ticket> p2 = Arrays.asList(new Ticket("E", "LE"), new Ticket("F", "LF"), new Ticket("G", "LG"));
		List<Ticket> p3 = Arrays.asList(new Ticket("I", "LI"), new Ticket("J", "LJ"), new Ticket("K", "LK"));
		Tickets tickets = Tickets.parallel(p1);
		String value = tickets.bubble().stream().<String>map(Ticket::distinguishedName).collect(Collectors.joining(","));
		Assertions.assertEquals("A,B,C", value);
		Optional<Ticket> opt = tickets.findTicketWithLabel("LB");
		tickets.add(opt.get(), p2, false, Tickets.MODE_QUEUE);
		value = tickets.bubble().stream().<String>map(Ticket::distinguishedName).collect(Collectors.joining(","));
		Assertions.assertEquals("A,C,E", value);
		tickets.completed("LE");
		value = tickets.bubble().stream().<String>map(Ticket::distinguishedName).collect(Collectors.joining(","));
		Assertions.assertEquals("A,C,F", value);
		tickets.completed("LA");
		value = tickets.bubble().stream().<String>map(Ticket::distinguishedName).collect(Collectors.joining(","));
		Assertions.assertEquals("C,F", value);
		tickets.completed("LF");
		value = tickets.bubble().stream().<String>map(Ticket::distinguishedName).collect(Collectors.joining(","));
		Assertions.assertEquals("C,G", value);
		tickets.completed("LC");
		value = tickets.bubble().stream().<String>map(Ticket::distinguishedName).collect(Collectors.joining(","));
		Assertions.assertEquals("G", value);
		tickets.completed("LG");
		value = tickets.bubble().stream().<String>map(Ticket::distinguishedName).collect(Collectors.joining(","));
		Assertions.assertEquals("", value);
	}

	@DisplayName("B后加签EFG,FEG串行处理,AC先处理")
	@Test
	@Order(2)
	void test02() {
		List<Ticket> p1 = Arrays.asList(new Ticket("A", "LA"), new Ticket("B", "LB"), new Ticket("C", "LC"));
		List<Ticket> p2 = Arrays.asList(new Ticket("E", "LE"), new Ticket("F", "LF"), new Ticket("G", "LG"));
		List<Ticket> p3 = Arrays.asList(new Ticket("I", "LI"), new Ticket("J", "LJ"), new Ticket("K", "LK"));
		Tickets tickets = Tickets.parallel(p1);
		String value = tickets.bubble().stream().<String>map(Ticket::distinguishedName).collect(Collectors.joining(","));
		Assertions.assertEquals("A,B,C", value);
		Optional<Ticket> opt = tickets.findTicketWithLabel("LB");
		tickets.add(opt.get(), p2, false, Tickets.MODE_QUEUE);
		value = tickets.bubble().stream().<String>map(Ticket::distinguishedName).collect(Collectors.joining(","));
		Assertions.assertEquals("A,C,E", value);
		tickets.completed("LA");
		value = tickets.bubble().stream().<String>map(Ticket::distinguishedName).collect(Collectors.joining(","));
		Assertions.assertEquals("C,E", value);
		tickets.completed("LC");
		value = tickets.bubble().stream().<String>map(Ticket::distinguishedName).collect(Collectors.joining(","));
		Assertions.assertEquals("E", value);
		tickets.completed("LE");
		value = tickets.bubble().stream().<String>map(Ticket::distinguishedName).collect(Collectors.joining(","));
		Assertions.assertEquals("F", value);
		tickets.completed("LF");
		value = tickets.bubble().stream().<String>map(Ticket::distinguishedName).collect(Collectors.joining(","));
		Assertions.assertEquals("G", value);
		tickets.completed("LG");
		value = tickets.bubble().stream().<String>map(Ticket::distinguishedName).collect(Collectors.joining(","));
		Assertions.assertEquals("", value);
	}

}
